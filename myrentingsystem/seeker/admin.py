from django.contrib import admin
from seeker.models import RoomRequest

# Register your models here.

@admin.register(RoomRequest)
class RoomRequestAdmin(admin.ModelAdmin):
    list_display = ('seeker', 'room', 'requested_at', 'status')
    list_filter = ('status', 'requested_at')
    search_fields = ('seeker__username', 'room__title')
    raw_id_fields = ('seeker', 'room')
    ordering = ('-requested_at',)

