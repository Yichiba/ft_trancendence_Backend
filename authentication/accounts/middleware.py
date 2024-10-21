import requests
from datetime import datetime
from django.utils.deprecation import MiddlewareMixin
import jwt
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from django.contrib import messages


JWT_SECRET_KEY = "yichiba94@"

from functools import wraps
from rest_framework.response import Response


def requires_authentication(view_func):
    print("authenticated decorator.\n")
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if args:
            request = args[0]
        print("request.user ",request.user)
        if request.is_authenticated :
            return view_func(request, *args, **kwargs)
        return Response({'error': 'Authentication required'}, status=401)
    return wrapper



def not_authenticated(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        print("not authenticated decorator.")

        if args:
            request = args[0]
        if request.is_authenticated :
            messages.info(request,'you are already logged in !!!')
            return redirect("home")
        return view_func(request, *args, **kwargs)
    return wrapper


def JWTCheck(token, purpose):
    try:
        print("Checking JWT...")
        if purpose == "Authorization":
            token = token.split(" ")
        else:
            token = token.split("=")
        payload = jwt.decode(token[1], JWT_SECRET_KEY, algorithms=['HS256']) 
        return payload
    
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
        return None

    except jwt.InvalidTokenError:
        print("Invalid token.")
        return None


class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        from .models import CustomUser
        print("Processing request in middleware...",request.headers.get('Authorization')
)
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization')
            payload = JWTCheck(token, "Authorization")
            print("payload",payload)
            if payload:
                request.user_data = payload
                print("here username  ",payload["username"])
                request.user = CustomUser.objects.get(username= payload['username'])
                print("here2 ")
                request.is_authenticated = True
            else:
                request.user_data = None    
                request.is_authenticated = False
        else:
            print("No JWT in cookies.")
            request.user_data = None
            request.is_authenticated = False
        print("out of middleware...",  request.is_authenticated)
    
    
    
    
# class DisableCSRF(MiddlewareMixin):
#     def process_request(self, request):
#         setattr(request, '_dont_enforce_csrf_checks', True)