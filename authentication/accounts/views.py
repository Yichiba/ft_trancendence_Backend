import requests
from . import serializers, remote_login, models, middleware
from .middleware import requires_authentication, not_authenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers import RegisterSerializer, UploadSerializer
from django.conf import settings
from django.shortcuts import redirect, render
import urllib.parse
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from django.middleware.csrf import get_token

@api_view(['POST'])
def change_passwrd(request,username):
    
    if request.method == 'POST':
        new_password = request.data.get('password')
        if new_password:
            user = models.CustomUser.objects.get(username=username)
            serializer = UploadSerializer(user,data=request.data,context={'request': request}, partial=True)
            if serializer.is_valid():
                user = serializer.save()
                return Response({"password changed successfully"},status=200)
            else:
                return Response({"Error : password is EMPTY or NOT VALID !!!"},status=404)
        return Response({"Error : password is EMPTY or NOT VALID !!!"},status=404)
    pass

class friends(APIView):
    @requires_authentication
    def send_friend_request(request,username):
        user1 = request.user
        user2=models.CustomUser.objects.get(username=username)
        if user2:
            try:
                user1_friend = models.FriendShip.objects.get(user2 = user2)
                print("user1_friend",user1_friend.status)
                response = remote_login.generateResponse(request," u might be a friend ",200)
                return response

            except models.FriendShip.DoesNotExist:
                user1_friend = models.FriendShip.objects.create(user1=user1,user2=user2)
                user1_friend.save()
                response = remote_login.generateResponse(request," request sent succesfully ",200)
                return response
        response = remote_login.generateResponse(request," ok ",200)
        return response

    @requires_authentication
    def accept_friend_request(request,username):
        user1 = request.user
        try:
            user2 = models.CustomUser.objects.get(username=username)
            try:
                user1_friend = models.FriendShip.objects.filter(user1=user1,user2=user2)
                user1_friend.status = True
                user1_friend.save()
                return Response({f"{user2}  is your friend"},status=200)
            except:
                print("friendship dosent exist ")
                return Response({f"no frienship found{user2}"},status=404)
        except:
                print("user dosent  exist ")
                return Response({f"no no user found with this username : {username}"},status=404)


    @requires_authentication
    def reject_friend_request(request,username):
        user1 = request.user
        try:
            user2 = models.CustomUser.objects.get(username=username)
            try:
                user1_friend = models.FriendShip.objects.filter(user1=user1,user2=user2)
                user1_friend.status = True
                return Response({f"{user2}  is your friend"},status=200)
            except:
                print("friendship dosent exist ")
                return Response({f"no frienship found{user2}"},status=404)
        except:
                print("user dosent  exist ")
                return Response({f"no no user found with this username : {username}"},status=404)




class login_view(APIView):
    def get(self,request):
        print("get login")
        message = 'Loggin page '
        response = remote_login.generateResponse(request,message,status.HTTP_200_OK)
        return response
    def post(self,request):
        print("from loginView Fun")
        username = request.data.get('username')
        password = request.data.get('password')
        print("request. use11r", request.user)
        user = authenticate(username=username, password=password)
        print("request. user", request.user)
        if user is not None:
            message = 'Logged in successfully!'
            request.user = user
            response = remote_login.generateResponse(request,message,status.HTTP_200_OK)
            return response
        else:
            return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)


class logout_view(APIView):
    @requires_authentication
    def post(self, request):
        print(" request fro logpiut ",request.user)
        logout(request=request)
        response = Response({'message': 'Logged out successfully!'},status=status.HTTP_200_OK)
        response.delete_cookie('JWT_token')
        response.delete_cookie("X-CSRFToken")
        return response
    


class RegisterView(APIView):
    @not_authenticated
    def get(self, request):
        return render(request, 'register.html')
    @not_authenticated
    def post(self, request):
        print("from reister_view Fun")
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print("requestaaaaa. user", request.user)
            request.user = user
            message = ' signed and Logged in successfully!'
            response = remote_login.generateResponse(request,message,status.HTTP_200_OK)            
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class home_view(APIView):
    @requires_authentication
    def get(self,request):
        print("request.user",request.user)
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
    parser_classes = (MultiPartParser, FormParser)

    @requires_authentication
    def get(self, request, username):
        try:
            if username == "me":
                username = request.user_data['username']
            user = models.CustomUser.objects.get(username=username)
            img_url = user.profile_picture.url
            print("img url:", img_url)
            
            response = Response({
                "user_id": user.id,
                "username":user.username,
                "email": user.email,
                "lastname": user.last_name,
                "profile_picture": img_url
            })
            return response
        except models.CustomUser.DoesNotExist:
            return Response({'error': f'User {username} not found!'}, status=404)
    @requires_authentication
    def post(self, request, username):
        response = Response()
        try:
            if username == "me":
                username = request.user_data['username']
            print("username ",username)
            if username == request.user_data['username']:
                user = models.CustomUser.objects.get(username=username)
                serialiser = UploadSerializer(user,data=request.data,context={'request': request},partial=True)
                if serialiser.is_valid():
                    print("valid serializer")
                    user = serialiser.save()
                    token = remote_login.generate_jwt(user=user,tamp=180)
                    response =  Response({'message': ' updated successfully!',"JWT token":token})
                    response.set_cookie("jwt",token,10800 )
                    print("saveed succesfully ")
                    return response
                else:
                    response =  Response({'message': ' passwrd not strong!'})
                    return response                
                    
            else:
                response =  Response({'message': ' not authorized to modify this user!'})
                return response                
        except models.CustomUser.DoesNotExist:
            return Response({'error': f'User {username} not found!'}, status=404)





@api_view(['POST',"GET"])
def forgot_passwd(request):
    print("from forgot fun ")
    if request.method == 'GET':
        return Response({"enter your Email "},status=200)        
    if request.method == 'POST':
        email = request.data.get('email')
        if email :
            try:
                user = models.CustomUser.objects.get(email=email)
                print("user",user)
                remote_login.send_email(user)
                return Response({"check your Email "},status=200)
            
            except models.CustomUser.DoesNotExist :
                return Response({f"user with email '{email}'noot found"},status=200)
    return Response({"Error :Email is EMPTY or NOT VALID !!!"},status=404)



@api_view(["POST"])
def reset_password(request,token):
    print("from reset fun ")
    if  request.method == 'POST':
        print("request ", request)
        new_password = request.data.get('password')
        print("new_password",new_password)
        if new_password:
            print("new_password",new_password)
            print("token",token)
            payload = middleware.JWTCheck(token, "jwt")
            print("payload",payload)
            if payload:
                    user = models.CustomUser.objects.get(username=payload['username'])
                    serializer = UploadSerializer(user,data=request.data,context={'request': request}, partial=True)
                    if serializer.is_valid():
                        user = serializer.save()
                        return Response({"password changed successfully"},status=200)
                    else:
                        return Response({"Error : password is EMPTY or NOT VALID !!!"},status=404)
            else:
                return Response({"token Expired or not vaalid anymore"},status=404)
        return Response({"token expired or is not vaalid"},status=404)
    return Response({"Error : password is EMPTY or NOT VALID !!!"},status=404)