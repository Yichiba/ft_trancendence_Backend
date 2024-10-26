from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q
from . import media

class CustomUser(AbstractUser):
    username = models.CharField(max_length = 100, unique = True)
    first_name = models.CharField(max_length = 50)
    last_name = models.CharField(max_length = 50)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to="",default="default.jpg",)
    status = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=20, null=True)
    auth_2fa=models.BooleanField(default= False,null=True)

    def __str__(self):
        return self.username
    

class   FriendShip(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user1")
    user2 = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name="user2")
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    
    @classmethod
    def get_friends(cls, user):
        """Get all friends for a user."""
        # Find friendships where the specified user is user1 or user2, and the status is True.
        friendships = cls.objects.filter(
            (Q(user1=user) | Q(user2=user)) & Q(status=True)
        )
        # Extract friend users from the friendship records
        friends = [f.user2 if f.user1 == user else f.user1 for f in friendships]
        return friends