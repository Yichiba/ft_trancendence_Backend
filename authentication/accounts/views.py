import requests
from . import serializers, remote_login, models
from .middleware import requires_authentication, not_authenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.shortcuts import redirect, render
import urllib.parse
from django.http import HttpResponse




class login_view(APIView):
    def get(self,request):
        response = Response({'message':'loggin page !' }, status=status.HTTP_200_OK)
        return response
    def post(self,request):
        print("from loginView Fun")
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token = remote_login.generate_jwt(user)
            response = Response({'message':'Logged in successfully!' }, status=status.HTTP_200_OK)
            response.set_cookie("jwt",token,10800)
            return response
        else:
            return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)


class logout_view(APIView):
    @requires_authentication
    def post(self, request):
        print(" request fro logpiut ",request.user)
        logout(request=request)
        response = Response({'message': 'Logged out successfully!'},status=status.HTTP_200_OK)
        response.delete_cookie('jwt')
        return response
    


class RegisterView(APIView):
    # @not_authenticated
    def get(self, request):
        return render(request, 'register.html')
    # @not_authenticated
    def post(self, request):
        print("from reister_view Fun")
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = remote_login.generate_jwt(user=user)
            response = Response({'message':' signed and Logged in successfully!' }, status=status.HTTP_200_OK)
            response.set_cookie("jwt",token,10800)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class home_view(APIView):
    @requires_authentication
    def get(self,request):
        return Response("Home page",status=status.HTTP_200_OK)


def login_with_42(request):
    auth_url = "https://api.intra.42.fr/oauth/authorize"
    params = {
        "client_id": settings.UID,
        "redirect_uri": settings.REDIRECT_URI,
        "response_type": "code",
        "scope": "public"
    }
    string_params = ''
    for key ,value in params.items():
        if string_params:
            string_params += '&'
        string_params += f"{key}={value}"
    redirect_url = f"{auth_url}?{string_params}"
    return redirect(redirect_url)


class profile(APIView):
    def get(self,request):
        pass



class users(APIView):
    @requires_authentication
    def get(self,request,username):
        user = models.CustomUser.objects.get(username=username)
        img_url = user.profile_picture.url
        print("img url :",img_url)
        
        if user:
            response = Response ({
            "user_id": user.id,
            "email" :user.email,
            "lastname":user.last_name ,
            "profile_picture":img_url
            })
            return response
        return Response({'User %s  Not found !! ',username},status=401)
    def post(self,request,username):
        if request.user.username == username:
            pass
        pass
        