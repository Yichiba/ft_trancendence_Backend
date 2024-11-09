from django.urls import path
from .views import HomeView , RoomView
from .views import RoomList, MessageList
from . import views 

urlpatterns = [ 
    path('api/rooms/<str:username>', views.RoomList, name="room_list"),
    path('api/messages/', MessageList.as_view(), name="message_list"),
    path("", HomeView, name="login"),
    path("<str:room_name>/<str:username>/", RoomView, name="room"),
    path('api/chat/<str:room_name>/', views.chat_room_data, name='chat_room_data'),
]
