from django.db.models.signals import post_save
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from seeker.models import RoomRequest
from ownerrooms.models import Room
from notification.models import Notification


# Notify seeker when their room request is approved
@receiver(post_save, sender=RoomRequest)
def notify_seeker_on_request_update(sender, instance, created, **kwargs):
    if not created:  # only if updating (not creating)
        print(f"Room request {instance.pk} updated, status: {instance.status}")
        
        # Check if status is approved or rejected
        if instance.status == 'approved':
            print(f"Creating approval notification for user: {instance.seeker.username}")
            notification = Notification.objects.create(
                user=instance.seeker,
                title="Room Request Approved",
                message=f"Your request for the room '{instance.room.title}' has been approved."
            )
            print(f"Approval notification created with ID: {notification.id}")
        elif instance.status == 'rejected':
            print(f"Creating rejection notification for user: {instance.seeker.username}")
            notification = Notification.objects.create(
                user=instance.seeker,
                title="Room Request Rejected",
                message=f"Your request for the room '{instance.room.title}' has been rejected."
            )
            print(f"Rejection notification created with ID: {notification.id}")

# Notify owner when they receive a new room request
@receiver(post_save, sender=RoomRequest)
def notify_owner_on_new_request(sender, instance, created, **kwargs):
    if created:  # only when a new request is created
        print(f"Creating new request notification for room owner: {instance.room.owner.username}")
        notification = Notification.objects.create(
            user=instance.room.owner,
            title="New Room Request",
            message=f"You have received a new request for your room '{instance.room.title}' from {instance.seeker.username}."
        )
        print(f"New request notification created with ID: {notification.id}")

# Notify owner when their room is approved by admin
@receiver(pre_save, sender=Room)
def notify_owner_on_room_approval(sender, instance, **kwargs):
    if instance.pk:  # only run if updating an existing Room
        old_instance = Room.objects.get(pk=instance.pk)
        if not old_instance.is_approved and instance.is_approved:
            print(f"Creating room approval notification for room owner: {instance.owner.username}")
            notification = Notification.objects.create(
                user=instance.owner,
                title="Room Approved",
                message=f"The room '{instance.title}' has been approved by the admin."
            )
            print(f"Room approval notification created with ID: {notification.id}")

