from django.db.models.signals import post_save
from django.dispatch import receiver
from seeker.models import RoomRequest
from ownerrooms.models import Room
from notification.models import Notification

@receiver(post_save, sender=RoomRequest)

def notify_seeker_on_request_update(sender, instance, created,** kwargs):
    if not created and  instance.status  == 'approved':
        Notification.objects.create(
            user=instance.seeker,
            message=f"Your request for the room '{instance.room.title}' has been approved."
        )

@receiver(post_save, sender=Room)
def notify_owner_on_room_approval(sender, instance, created, **kwargs):
    if not created and instance.status == 'approved':
        Notification.objects.create(
            user=instance.owner,
            message=f"The room '{instance.title}' has been approved by the admin."
        )