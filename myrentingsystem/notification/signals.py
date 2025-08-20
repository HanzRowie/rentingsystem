from django.db.models.signals import post_save
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from seeker.models import RoomRequest
from ownerrooms.models import Room
from notification.models import Notification


# Notify seeker when their room request is approved
@receiver(pre_save, sender=RoomRequest)
def notify_seeker_on_request_update(sender, instance, **kwargs):
    if instance.pk:  # only if updating
        old_instance = RoomRequest.objects.get(pk=instance.pk)
        if old_instance.status != instance.status and instance.status == 'approved':
            Notification.objects.create(
                user=instance.seeker,
                message=f"Your request for the room '{instance.room.title}' has been approved."
            )



# Notify owner when their room is approved by admin
@receiver(pre_save, sender=Room)
def notify_owner_on_room_approval(sender, instance, **kwargs):
    if instance.pk:  # only run if updating an existing Room
        old_instance = Room.objects.get(pk=instance.pk)
        if not old_instance.is_approved and instance.is_approved:
            Notification.objects.create(
                user=instance.owner,
                message=f"The room '{instance.title}' has been approved by the admin."
            )
