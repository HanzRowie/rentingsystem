from django.contrib import admin
from ownerrooms.models import Room

# Register your models here.

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'location', 'price', 'available','is_approved', 'created_at')
    search_fields = ('title', 'location')
    list_filter = ('available', 'created_at')
    ordering = ('-created_at',)