from django.contrib import admin
from ownerrooms.models import Room

# Register your models here.

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'location', 'price', 'available','is_approved', 'created_at')
    search_fields = ('title', 'location')
    list_filter = ('available', 'created_at')
    ordering = ('-created_at',)
    actions = ['approve_rooms', 'disapprove_rooms']

    def approve_rooms(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} rooms successfully approved.")
    approve_rooms.short_description = "Approve selected rooms"

    def disapprove_rooms(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} rooms successfully disapproved.")
    disapprove_rooms.short_description = "Disapprove selected rooms"
