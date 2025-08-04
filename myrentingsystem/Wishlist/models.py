from django.db import models
from ownerrooms.models import Room
from django.conf import settings

class Wishlist(models.Model):
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'seeker'}, related_name='wishlist_items')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seeker', 'room')  

    def __str__(self):
        return f"{self.seeker.username} wishlist -> {self.room.title}"
