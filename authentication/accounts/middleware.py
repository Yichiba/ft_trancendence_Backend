import requests
from django.utils.deprecation import MiddlewareMixin
import jwt


JWT_SECRET_KEY="yichiba94@"


# ijwt.

def JWTCheck(token):
    print("token ",token)
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        print("Payload:", payload)
        return payload  

    except jwt.ExpiredSignatureError:
        print("Token has expired.")
        return None

    except jwt.InvalidTokenError:
        print("Invalid token.")
        return None
  




class JWTAuthenticationMiddleware(MiddlewareMixin):
    
    def process_request(self, request):
    # Check if the JWT cookie exists
        if "jwt" in request.COOKIES:
            JWTCheck(request.COOKIES["jwt"])
        else:
            pass