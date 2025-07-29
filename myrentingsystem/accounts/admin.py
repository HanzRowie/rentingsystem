from django.contrib import admin
from accounts.models  import CustomUser, Profile

# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('role', 'is_staff', 'is_active')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):       
    list_display = ('user', 'phone', 'address')
    search_fields = ('user__username', 'phone')
    list_filter = ('user__role',)
    