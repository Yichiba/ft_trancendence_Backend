from django.db import models
from django.contrib.auth.models import AbstractUser
from . import media

class CustomUser(AbstractUser):
    username = models.CharField(max_length = 100, unique = True)
    first_name = models.CharField(max_length = 50)
    last_name = models.CharField(max_length = 50)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to="media/",default="media/defaults.jpeg",)

    def __str__(self):
        return self.username