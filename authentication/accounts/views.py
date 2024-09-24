from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .serializers import RegisterSerializer

class login_view(APIView):
    def post(self,request):    
        username = request.data.get('username')
        password = request.data.get('password')


        user = authenticate(username=username, password=password)
        print(username, password, user )
        if user is not None:
            login(request, user)
            return Response({'message' :'Logged in successfully!'},status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)


class logout_view(APIView):
    def logout(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully!'},status=status.HTTP_200_OK)
    


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # This will create the user
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
