from django.contrib import admin
from Wishlist.models import Wishlist

# Register your models here.

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('seeker', 'room', 'added_at')
    search_fields = ('seeker__username', 'room__title')
    list_filter = ('added_at',)
    ordering = ('-added_at',)
