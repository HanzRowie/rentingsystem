from django.db import models
from django.conf import settings
from ownerrooms.models import Room  # import Room model

class RoomRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    seeker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'seeker'},
        related_name='room_requests_sent'
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='room_requests'
    )
    message = models.TextField(blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.seeker.username} -> {self.room.title} ({self.status})"

