
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')), 
    path('ownerrooms/', include('ownerrooms.urls')), 
    path('seeker/', include('seeker.urls')),
    path('wishlist/', include('Wishlist.urls')),
]
