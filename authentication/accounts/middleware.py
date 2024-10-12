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
    @wraps(view_func)  # Preserves function metadata
    def wrapper(request, *args, **kwargs):
        from django.contrib.auth.models import AnonymousUser
        from .models import CustomUser
        request = args[0]
        if request.is_authenticated :
            user = CustomUser.objects.get(id=request.user_data['sub'])
            request.user = user
            print("request is authenticated ")
            return view_func(request, *args, **kwargs)
        elif request.user_data:
            user = CustomUser.objects.get(id=request.user_data['sub'])
            request.user = user
            request.is_authenticated = True
            return view_func(request, *args, **kwargs)
        return Response({'error': 'Authentication required'}, status=401)
    return wrapper



def not_authenticated(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        request = args[0]
        if request.is_authenticated :
            messages.info(request,'you are already logged in !!!')
            return redirect("home")
        return view_func(request, *args, **kwargs)
    return wrapper



def JWTCheck(token):
    try:
        # Decode the token and return the payload if valid
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256']) 
        # print("payload ", payload)
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
        print("Processing request in middleware...")
        if "jwt" in request.COOKIES:
            payload = JWTCheck(request.COOKIES["jwt"])
            if payload:
                request.user_data = payload
                request.is_authenticated = True
            else:
                request.user_data = None
                request.is_authenticated = False
        else:
            print("No JWT in cookies.")
            request.user_data = None
            request.is_authenticated = False
    