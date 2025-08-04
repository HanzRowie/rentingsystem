from django.db import models
from django.conf import settings
from ownerrooms.models import Room  # import Room model

class RoomRequest(models.Model):
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'seeker'}, related_name='room_requests_sent')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room_requests')  # fix here
    message = models.TextField(blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.seeker.username} -> {self.room.title}"
