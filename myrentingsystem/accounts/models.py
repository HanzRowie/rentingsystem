from django.db import models
from django.contrib.auth.models import AbstractUser
from  django.conf import settings

# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'admin'),   
        ('seeker', 'seeker'),
        ('room owner', 'room owner'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='seeker')

    def __str__(self):
        return self.username
    
class Profile(models.Model):
    user  = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone =  models.CharField(max_length=13, blank=True,null=True)
    address = models.CharField(max_length=100,blank=True,null=True)
    profile_picture = models.ImageField(upload_to='profile_picture/', blank=True,null=True)

    def  __str__(self):
        self.user.username