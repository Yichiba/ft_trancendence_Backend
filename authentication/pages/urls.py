from django.urls import path
from .views import HomeView , RoomView

urlpatterns = [
    path("chat/", HomeView, name="login"),
    path("chat/<str:room_name>/<str:username>/", RoomView, name="room")
]
