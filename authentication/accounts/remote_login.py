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
from .serializers import RegisterSerializer, UploadSerializer
import datetime
import jwt
from rest_framework.views import APIView
from django.core.files.base import ContentFile
from django.core.mail import send_mail
import smtplib
from email.mime.text import MIMEText
from django.middleware.csrf import get_token



def generateResponse(request, msg, status_code):
    print("Generating response")

    token = None

    if request.user.is_authenticated:
        request.user.status = True
        request.user.save()
        token = generate_jwt(request.user, tamp=180)
    csrf_token = get_token(request)
    response = Response({'message': msg}, status=status_code)
    response.set_cookie("X-CSRFToken", csrf_token)
    response.set_cookie("JWT_token", token)
    return response


JWT_SECRET_KEY="yichiba94@"

def generate_jwt(user,tamp):

    payloads = {
        "sub": user.id,
        "username":user.username,
        "email":user.email,
        "iat":datetime.datetime.now().timestamp(),
        "exp":(datetime.datetime.now() + datetime.timedelta(minutes = tamp)).timestamp()
    }
    token = jwt.encode(payloads, JWT_SECRET_KEY, 'HS256')
    return token

def send_email(user):
    message = MIMEText("")
    message["Subject"] = 'reset password -Trancendence'
    message["From"] = "youssefichiba@gmail.com"
    message["To"] = user.email
    token = generate_jwt(user,5)
    url = "http://127.0.0.1:8000/reset_password/"+token
    message = MIMEText(url)

    try:
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            server.sendmail(settings.EMAIL_HOST_USER, user.email, message.as_string())
    except Exception as e:
        print(f"Error: {e}")    

    
def get_profile_pict(img_url):
    response = requests.get(url=img_url)
    if response.status_code == 200:
        return ContentFile(response.content)
    return None
    
def save_profile_picture(user, image_url):
    image_file = get_profile_pict(image_url)
    if image_file:
        file_name = f'{user.username}_profile.jpg'
        user.profile_picture.save(file_name, image_file)
        user.save()

def remote_login( user_data, request):
    print("from remote_login Fun")
    random_pasword = get_random_string(12)
    validated_data = {
        "42_login":True,
        "username": user_data['login'],
        "first_name": user_data['first_name'],
        "last_name": user_data['last_name'],
        "email": user_data['email'],
        "password": random_pasword,
        "password_confirm":random_pasword
    }
    try:
        existing_user = CustomUser.objects.get(email=validated_data['email'])
        return existing_user
    except CustomUser.DoesNotExist:
        serializer = RegisterSerializer(data=validated_data)
        if serializer.is_valid():
            new_user = serializer.save()
            save_profile_picture(new_user,user_data['image']['versions']['small'])
            return new_user
    return None

def fetch_user_data(access_token):
    user_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}',}

    response = requests.get(user_url, headers=headers)
    
    if response.status_code == 200:
        return response.json()  
    return None  


class  callback_with_42(APIView):
    
    def get(self,request):
        print("callback funcxxxxx")
        code = request.GET.get('code')
        print("callback func")
        if code:
            token_url = 'https://api.intra.42.fr/v2/oauth/token'
            payload = {
                'grant_type': 'authorization_code',
                'client_id': settings.UID,
                'client_secret': settings.SECRET,
                'redirect_uri': settings.REDIRECT_URI,
                'code': code
            }
            print("payload",payload)
            response = requests.post(token_url, json=payload)
            print("response",response.status_code)
            if response.status_code == 200:
                access_token = response.json().get('access_token')
                user_data = fetch_user_data(access_token)
                user = remote_login(user_data,request)
                if user :
                    request.user = user
                    message = 'Logged in successfully!'
                    response = generateResponse(request,message,status.HTTP_200_OK)
                    return response
                else:
                    return Response({'message': 'Login failed. User not found or invalid.','redirect':'home/'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Failed to obtain access token.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'No authorization code found.'}, status=status.HTTP_400_BAD_REQUEST)
    
