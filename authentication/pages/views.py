from django.shortcuts import render, redirect
from rest_framework import generics
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

# def HomeView(request):
#     if request.method == "POST":
#         username1 = request.POST["username1"]
#         username2 = request.POST["username2"]

#         if username1 == username2:
#             return render(request, "home.html", {"error": "Please enter different usernames"})
        
#         user1, user2 = sorted([username1, username2])

#         room, created = Room.objects.get_or_create(user1=user1, user2=user2, defaults={"room_name": f"{user1}_{user2}"})
#         return redirect("room", room_name=room.room_name, username=username1)
#     return render(request, "home.html")

# def RoomView(request, room_name, username):
#     existing_room = Room.objects.get(room_name__icontains=room_name)
#     get_messages = Message.objects.filter(room=existing_room)
#     context = {
#         "messages": get_messages,
#         "user": username,
#         "room_name": existing_room.room_name,
#     }
#     return render(request, "room.html", context)

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


class RoomList(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def get(self, request, *args, **kwargs):
        try:
            room  = Room.objects.all()
        except room.DoesNotExist:
            room = None
        if room:
            print("room",room)
        else:
            print("no message")
        print("from get")
        print("request.user",request.user)
        return self.list(request, *args, **kwargs)



class MessageList(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    def get(self, request, *args, **kwargs):
        try:
            message  = Message.objects.get()
        except Message.DoesNotExist:
            message = None
        if message:
            print("message",message)
        else:
            print("no message")
        print("from get")
        print("request.user",request.user)
        return self.list(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        print("from post")
        print("request.user",request.user)
        return self.create(request, *args, **kwargs)

# If this is not needed, it can be removed for clarity
@api_view(['GET'])
def get_messages(request, room_id):

    messages = Message.objects.filter(room_id=room_id)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
