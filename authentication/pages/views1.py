from django.shortcuts import render, redirect
from rest_framework import generics
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

def HomeView(request):
    if request.method == "POST":
        username1 = request.POST["username1"]
        username2 = request.POST["username2"]

        if username1 == username2:
            return render(request, "home.html", {"error": "Please enter different usernames"})
        
        user1, user2 = sorted([username1, username2])

        room, created = Room.objects.get_or_create(user1=user1, user2=user2, defaults={"room_name": f"{user1}_{user2}"})
        return redirect("room", room_name=room.room_name, username=username1)
    return render(request, "home.html")

def RoomView(request, room_name, username):
    existing_room = Room.objects.get(room_name__icontains=room_name)
    get_messages = Message.objects.filter(room=existing_room)
    context = {
        "messages": get_messages,
        "user": username,
        "room_name": existing_room.room_name,
    }
    return render(request, "room.html", context)

def chat_room_data(request, room_name):
    messages = Message.objects.filter(room__room_name=room_name)
    messages_data = [
        {
            "sender": message.sender,
            "message": message.message,
            # Add other fields if needed
        }
        for message in messages
    ]
    return JsonResponse({"messages": messages_data, "user": request.user.username})



api_view(['GET'])
def RoomList(request,username):
    print("user = ", request.user.username)
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class MessageList(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

# If this is not needed, it can be removed for clarity
@api_view(['GET'])
def get_messages(request, room_id):
    messages = Message.objects.filter(room_id=room_id)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
