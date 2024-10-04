import requests
from datetime import datetime
from django.utils.deprecation import MiddlewareMixin
# from django.http import HttpResponse
import jwt
from rest_framework.response import Response
from rest_framework import status




JWT_SECRET_KEY = "yichiba94@"

def JWTCheck(token):
    try:
        # Decode the token and return the payload if valid
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256']) 
        return payload
    
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
        return None

    except jwt.InvalidTokenError:
        print("Invalid token.")
        return None


class JWTAuthenticationMiddleware(MiddlewareMixin):
    # protected_view[]= {}
    def process_request(self, request):
        # Check if the JWT cookie exists
        if "jwt" in request.COOKIES:
            # Validate and decode the token
            payload = JWTCheck(request.COOKIES["jwt"])
            
            if payload:
                request.user_data = payload
            else:
                # If the token is invalid or expired, you can either:
                # - Allow the request to proceed (for public views)
                # - Return a 401 Unauthorized response (for protected views)
                pass  # You can handle this based on your app's needs
        else:
            # Handle missing JWT cookie here
            pass
