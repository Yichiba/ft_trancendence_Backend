from django.urls import path
from .views import RoomList, MessageList

urlpatterns = [ 
    path('api/rooms/', RoomList.as_view(), name="room_list"),
    path('api/messages/', MessageList.as_view(), name="message_list"),
    # path('send/<username>', MessageList.as_view(), name="message_list"),
    # path('send/user', MessageList.as_view(), name="message_list"),
]
