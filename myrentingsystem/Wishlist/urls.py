from django.urls import path
from Wishlist.views import WishlistView


urlpatterns = [
    path('wishlist/', WishlistView.as_view(), name='wishlist-list'),
    path('wishlist/<int:room_id>/', WishlistView.as_view(), name='wishlist-add'),
]