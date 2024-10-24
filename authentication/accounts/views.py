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


# @requires_authentication
# @api_view(["GET"])
# def get_online_friends(request):
#     online = []
#     try:
#         # Make a GET request to the 'friends/' API endpoint
#         response = requests.get(f"{settings.API_BASE_URL}/friends/")
        
#         # Check if the request was successful
#         if response.status_code == 200:
#             friends = response.json()  # Assuming the response is in JSON format
            
#             for friend in friends:
#                 if friend['status']:
#                     if friend['user1'] != request.user.username:
#                         user1 = models.CustomUser.objects.get(username=friend['user1'])
#                         if user1.status:
#                             online.insert(0, user1.username)
#                     else:
#                         user2 = models.CustomUser.objects.get(username=friend['user2'])
#                         if user2.status:
#                             online.insert(0, user2.username)
#             return Response({"online friends": online}, status=200)
#         else:
#             return Response({"error": "Failed to fetch friends"}, status=response.status_code)
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)

@requires_authentication
@api_view(["GET"])
def get_online_friends(request):
    online = []
    i = 0
    try:
        friends = models.FriendShip.objects.filter(user1=request.user) | models.FriendShip.objects.filter(user2=request.user)
        for friend in friends:
            i = i  +1
            if friend.status:
                if friend.user1.username != request.user.username:
                    user = models.CustomUser.objects.get(username=friend.user1.username)
                    if user.status:
                        online.insert(0,user.username)
                else:
                    user = models.CustomUser.objects.get(username=friend.user2.username)
                    if user.status:
                        online.insert(0,user.username)
        return Response({f" online friend :{online}"}, status=200)
    except:
        return Response({" error : friends  dsosenr exisr "}, status=404)






@api_view(['POST',"GET"])
def change_passwrd(request,username):
    if request.method == 'GET':
        active_users = []
        users = models.CustomUser.objects.all()
        for user in users:
            active_users.insert(0,user.username)
        return Response({f"users = {active_users}"},status=200)
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
    
@requires_authentication
@api_view(["GET"])
def get_friends(request):
    active_friends = []
    friend_requests = []
    user = request.user
    try:
        friends = models.FriendShip.objects.filter(user1=user) | models.FriendShip.objects.filter(user2=user)
        if friends.exists():
            for friend in friends:
                if friend.status == True:
                    if friend.user1 == user:
                        active_friends.insert(0,friend.user2.username)
                    else:
                        active_friends.insert(0,friend.user1.username)
                else:
                    if friend.user1 == user:
                        friend_requests.insert(0,friend.user2.username)
                    else:
                        friend_requests.insert(0,friend.user1.username)
            return Response(f"friends:{active_friends} ..."f"     friends_request:{friend_requests}",status=200)
        else:
            return Response({"message": "nothing "}, status=200)
   
    except models.FriendShip.DoesNotExist:
        return Response({"message": "no friends "}, status=200)
    
    
    
@requires_authentication
@api_view(["POST"])
def send_friend_request(request, username):
    user1 = request.user
    try:
        
        user2 = models.CustomUser.objects.get(username=username)
        
        if user1 != user2:
            
            try:
                
                existing_friendship = models.FriendShip.objects.get(user1=user1,user2=user2)
                if existing_friendship.status:
                    return Response({f"{username} is already in your friendlist"},status=200)
                return Response({"message": f"You have a pending request from {username}"}, status=200)
            
            except models.FriendShip.DoesNotExist:
                
                try:
                    existing_friendship = models.FriendShip.objects.get(user1=user2,user2=user1)
                    if existing_friendship.status:
                        return Response({f"{username} is already in your friendlist"},status=200)
                    return Response({"message": f"You have a pending request from {username}"}, status=200)
                
                except models.FriendShip.DoesNotExist:
                    
                    models.FriendShip.objects.create(user1=user1, user2=user2)
                    return Response({"message": "Friend request sent successfully"}, status=200)
                
        return Response({"message": "u cannot send a request to ur self !!!"}, status=200)
    except models.CustomUser.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    
    
@api_view(["POST"])
@requires_authentication
def accept_friend_request(request, username):
    user1 = request.user
    try:
        user2 = models.CustomUser.objects.get(username=username)
        try:
            friendship = models.FriendShip.objects.get(user1=user2, user2=user1)
            if friendship.status == False:
                friendship.status = True
                friendship.save()
                return Response({"message": f"{user2.username} is now your friend"}, status=200)
            else:
                return Response({"message": f"{user2.username} is already in your friend list"}, status=200)
        except models.FriendShip.DoesNotExist:
            return Response({"message": "No friendship  found"}, status=404)
    except models.CustomUser.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

@api_view(["POST"])
@requires_authentication
def reject_friend_request(request, username):
    user1 = request.user
    try:
        user2 = models.CustomUser.objects.get(username=username)
        try:
            friendship = models.FriendShip.objects.get(user1=user1, user2=user2)
            friendship.delete()
            return Response({"message": f"User : {user2.username} is rejected from your friend"}, status=200)
        except models.FriendShip.DoesNotExist:
            try:
                friendship = models.FriendShip.objects.get(user1=user2, user2=user1)
                friendship.delete()
                return Response({"message": f"User : {user2.username} is rejected from your friend"}, status=200)
            except models.FriendShip.DoesNotExist:
                return Response({"message": "No friendship request found"}, status=404)
    except models.CustomUser.DoesNotExist:
        return Response({"message": "User not found"}, status=404)


class login_view(APIView):
    def get(self,request):
        html = """
        <html>
            <body>
            <form method="post" action="/login/">
                <label for="username">Username:</label><br>
                <input type="text" id="username" name="username"><br>
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="password"><br><br>
                <input type="submit" value="Submit">
            </form>
            </body>
        </html>
        """
        return HttpResponse(html)
        # print("get login")
        # message = 'Loggin page '
        # response = remote_login.generateResponse(request,message,status.HTTP_200_OK)
        # return response
    def post(self,request):
        print("from loginView Fun")
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
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
        state = request.user.status
        request.user.status = False
        request.user.save()
        user = models.CustomUser.objects.get(username=request.user.username)
        
        logout(request=request)
        response = Response({'message': f'Logged out successfully!  status = {user.status}  old state {state}'},status=status.HTTP_200_OK)
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
            request.user = user
            message = ' signed and Logged in successfully!'
            response = remote_login.generateResponse(request,message,status.HTTP_200_OK)            
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class home_view(APIView):
    @requires_authentication
    def get(self,request):
        return Response("Home page",status=status.HTTP_200_OK)


def login_with_42(request):
    print("login_with_42 fucn")
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
    print(" ouuuut redirect_url = ",redirect_url)
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
            print("image url = ",img_url)
            response = Response({
                "user_id": user.id,
                "username":user.username,
                "email": user.email,
                "lastname": user.last_name,
                "profile_picture": request.build_absolute_uri(img_url)
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
            if username == request.user_data['username']:
                user = models.CustomUser.objects.get(username=username)
                serialiser = UploadSerializer(user,data=request.data,context={'request': request},partial=True)
                if serialiser.is_valid():
                    user = serialiser.save()
                    token = remote_login.generate_jwt(user=user,tamp=180)
                    response =  Response({'message': ' updated successfully!',"JWT token":token})
                    response.set_cookie("jwt",token,10800 )
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
                remote_login.send_email(user)
                return Response({"check your Email "},status=200)
            
            except models.CustomUser.DoesNotExist :
                return Response({f"user with email '{email}'noot found"},status=200)
    return Response({"Error :Email is EMPTY or NOT VALID !!!"},status=404)



@api_view(["POST"])
def reset_password(request,token):
    print("from reset fun  ")
    if  request.method == 'POST':
        new_password = request.data.get('password')
        if new_password:
            payload = middleware.JWTCheck(token)
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