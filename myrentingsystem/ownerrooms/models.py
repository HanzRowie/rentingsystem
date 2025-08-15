from django.db import models
from django.conf import settings
# Create your models here.

class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('single', 'Single Room'),
        ('double', 'Double Room'),
        ('studio', 'Studio'),
        ('apartment', 'Apartment'),
        ('house', 'House'),
    ]
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'room owner'})
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, default='single')
    available = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to='rooms/', null=True, blank=True)

    def __str__(self):
        return self.title

 