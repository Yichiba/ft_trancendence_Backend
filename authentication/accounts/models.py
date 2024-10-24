from django.db import models
from django.contrib.auth.models import AbstractUser
from . import media

class CustomUser(AbstractUser):
    username = models.CharField(max_length = 100, unique = True)
    first_name = models.CharField(max_length = 50)
    last_name = models.CharField(max_length = 50)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to="",default="default.jpg",)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    

class   FriendShip(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name="user2")
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)