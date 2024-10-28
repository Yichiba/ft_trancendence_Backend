import pyotp
import qrcode
from io import BytesIO
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from django.core.cache import cache
from django.conf import settings
from rest_framework.permissions import IsAuthenticated

class Generate2FAView(APIView):
    QR_CODE_ISSUER = "YourApp"  # Change this to your app name
    OTP_VALIDITY_WINDOW = 1  # Number of time steps to accept before/after current time
    MAX_OTP_ATTEMPTS = 3
    OTP_LOCKOUT_TIME = 300  # 5 minutes in seconds
    
    def get_user_from_request(self, request):
        """Helper method to get user from either authentication or token"""
        if request.is_authenticated:
            return request.user
            
        token = request.GET.get('token')
        if not token:
            raise ValidationError("No authentication provided")
            
        try:
            payload = middleware.JWTCheck(token=token)
            return models.CustomUser.objects.get(username=payload['username'])
        except Exception as e:
            raise ValidationError("Invalid token")

    def generate_qr_code(self, secret, username):
        """Generate QR code for 2FA setup"""
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=username,
            issuer_name=self.QR_CODE_ISSUER
        )

        qr = qrcode.make(provisioning_uri)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def get_failed_attempts(self, user):
        """Get number of failed OTP attempts"""
        return cache.get(f'otp_attempts_{user.id}', 0)

    def increment_failed_attempts(self, user):
        """Increment failed OTP attempts"""
        attempts = self.get_failed_attempts(user) + 1
        cache.set(f'otp_attempts_{user.id}', attempts, self.OTP_LOCKOUT_TIME)
        return attempts

    def reset_failed_attempts(self, user):
        """Reset failed OTP attempts"""
        cache.delete(f'otp_attempts_{user.id}')

    def get(self, request):
        try:
            user = self.get_user_from_request(request)
            
            # Check if user is locked out
            if self.get_failed_attempts(user) >= self.MAX_OTP_ATTEMPTS:
                return Response({
                    "error": "Too many failed attempts. Please try again later."
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            if user.auth_2fa:
                # Return OTP input form for verified 2FA users
                html_content = render_to_string('2fa/otp_input.html', {
                    'action_url': '/login/',
                })
                return Response(html_content)

            # Generate new 2FA setup for first-time users
            secret = pyotp.random_base32()
            
            # Store the secret temporarily
            cache.set(f'temp_2fa_secret_{user.id}', secret, timeout=600)  # 10 minutes
            
            qr_base64 = self.generate_qr_code(secret, user.username)
            
            return Response({
                "qr_code": f"data:image/png;base64,{qr_base64}",
                "secret": secret,  # Only for initial setup
                "instructions": "Scan this QR code with your authenticator app"
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "An error occurred during 2FA setup"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            user = self.get_user_from_request(request)
            
            # Check if user is locked out
            if self.get_failed_attempts(user) >= self.MAX_OTP_ATTEMPTS:
                return Response({
                    "error": "Too many failed attempts. Please try again later."
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            otp = request.data.get('otp')
            if not otp:
                return Response({
                    "error": "OTP is required"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get the appropriate secret based on whether 2FA is already enabled
            if user.auth_2fa:
                secret = user.mfa_secret
            else:
                secret = cache.get(f'temp_2fa_secret_{user.id}')
                if not secret:
                    return Response({
                        "error": "2FA setup expired. Please try again."
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Verify OTP
            totp = pyotp.TOTP(secret)
            if totp.verify(otp, valid_window=self.OTP_VALIDITY_WINDOW):
                self.reset_failed_attempts(user)
                
                if user.auth_2fa:
                    response = remote_login.generateResponse(
                        request,
                        "2FA verification successful",
                        status.HTTP_200_OK
                    )
                    return response
                
                # Complete 2FA setup
                user.mfa_secret = secret
                user.auth_2fa = True
                user.save()
                
                # Clean up temporary secret
                cache.delete(f'temp_2fa_secret_{user.id}')
                
                return Response({
                    "message": "2FA successfully enabled",
                    "username": user.username
                }, status=status.HTTP_200_OK)
            
            # Handle failed verification
            attempts = self.increment_failed_attempts(user)
            remaining_attempts = self.MAX_OTP_ATTEMPTS - attempts
            
            return Response({
                "error": "Invalid OTP",
                "remaining_attempts": max(0, remaining_attempts)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": "An error occurred during OTP verification"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)