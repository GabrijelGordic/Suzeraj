from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_pics')
    bio = models.TextField(blank=True)
    
    # 1. CHANGE THIS LINE: Add unique=True
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=False) 
    
    location = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} Profile'