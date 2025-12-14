from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to='avatars/', default=None, blank=True)
    location = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(
        max_length=20, blank=True, null=True, unique=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s Profile"
