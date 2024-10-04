import requests
from .models import CustomUser
from django.contrib.auth import authenticate
from . import serializers, views 
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import redirect
from django.http import HttpResponse
from django.utils.crypto import get_random_string
from .serializers import RegisterSerializer
import datetime
import jwt


JWT_SECRET_KEY="yichiba94@"

def generate_jwt(user):

    payloads = {
        "sub": user.id,
        "username":user.username,
        "email":user.email,
        "iat":datetime.datetime.now().timestamp(),
        "exp":(datetime.datetime.now() + datetime.timedelta(hours= 3)).timestamp()
    }
    token = jwt.encode(payloads, JWT_SECRET_KEY, 'HS256')
    
    return token
    

def remote_login(user, request):
    print("from remote_login Fun")
    random_pasword = get_random_string(12)
    validated_data = {
        "42_login":True,
        "username": user['login'],
        "first_name": user['first_name'],
        "last_name": user['last_name'],
        "email": user['email'],
        "password": random_pasword,
        "password_confirm":random_pasword
    }
    existing_user = CustomUser.objects.filter(email=validated_data['email']).first()
    if existing_user:
        authenticated_user = authenticate(username=existing_user.username, password=existing_user.password)
        if authenticated_user:
            token = generate_jwt(user=authenticated_user)        
            response = Response({'message':'Logged in successfully!' }, status=status.HTTP_200_OK)
            response.set_cookie("jwt",token,10800)
            return response

    else:
        serializer = RegisterSerializer(data=validated_data)
        if serializer.is_valid():
            new_user = serializer.save()
            token = generate_jwt(user=new_user)
            response = Response({'message':'Registred And logged in successfully!' }, status=status.HTTP_200_OK)
            response.set_cookie("jwt",token,10800)
            return response

        else:
            return None
    return None

def fetch_user_data(access_token):
    user_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}',}

    response = requests.get(user_url, headers=headers)
    
    if response.status_code == 200:
        return response.json()  
    return None  


def callback_with_42(request):
    code = request.GET.get('code')
    if code:
        token_url = 'https://api.intra.42.fr/v2/oauth/token'
        payload = {
            'grant_type': 'authorization_code',
            'client_id': settings.UID,
            'client_secret': settings.SECRET,
            'redirect_uri': settings.REDIRECT_URI,
            'code': code
        }
        response = requests.post(token_url, data=payload)
        if response.status_code == 200:
            access_token = response.json().get('access_token')
            user_data = fetch_user_data(access_token)
            user_data = remote_login(user_data,request)
            return HttpResponse(f"Access token received: {access_token}")
        else:
            return HttpResponse("Failed to obtain access token.")
    return HttpResponse("No authorization code found.")
