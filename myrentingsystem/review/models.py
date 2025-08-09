from django.db import models
from django.conf import settings
from ownerrooms.models import Room

# Create your models here.

class Review(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reviews')
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'seeker'}, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('room', 'seeker')
        ordering = ['-create_at']

    def __str__(self):
        return f"Review by {self.seeker.username} for {self.room.title} - Rating: {self.rating}"