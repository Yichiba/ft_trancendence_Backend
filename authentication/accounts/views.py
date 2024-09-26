import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated


class login_view(APIView):
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            jwt_endpoint = 'http://localhost:8000/api/token/'  # Adjust URL as needed
            response = requests.post(jwt_endpoint, data={'username': username, 'password': password})
            if response.status_code == 200:
                access_token = response.json().get('access')
                refresh_token = response.json().get('refresh')
                return Response({
                    'message':'Logged in successfully!','access': access_token,"refresh " :refresh_token }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
        


class logout_view(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
            print('Helloooo')
            logout(request)
            return Response({'message': 'Logged out successfully!'},status=status.HTTP_200_OK)
    


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # This will create the user
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class home_view(APIView):
    def get(self,request):
        return Response("Home page",status=status.HTTP_200_OK)
