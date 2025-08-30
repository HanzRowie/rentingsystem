
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')), 
    path('ownerrooms/', include('ownerrooms.urls')), 
    path('seeker/', include('seeker.urls')),
    path('wishlist/', include('Wishlist.urls')),
    path('review/', include('review.urls')), 
    path('notification/', include('notification.urls')),  # Include notifications app URLs
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
