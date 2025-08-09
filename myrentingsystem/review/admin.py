from django.contrib import admin
from review.models import Review

# Register your models here.

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('room', 'seeker', 'rating', 'create_at')
    search_fields = ('room__title', 'seeker__username', 'comment')
    list_filter = ('rating', 'create_at')
    ordering = ('-create_at',)

    def room_title(self, obj):
        return obj.room.title

    def seeker_username(self, obj):
        return obj.seeker.username

    room_title.short_description = 'Room Title'
    seeker_username.short_description = 'Seeker Username'