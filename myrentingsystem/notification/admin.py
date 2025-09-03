from django.contrib import admin
from .models import Notification

# Register your models here.

admin.site.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('title', 'message')
    ordering = ('-created_at',)
    