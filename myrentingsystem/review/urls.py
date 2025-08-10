from django.urls import path
from review.views import ReviewView

urlpatterns = [
    path('reviews/', ReviewView.as_view(), name='review_list'),
    path('reviews/<int:room_id>/', ReviewView.as_view(), name='review_create'),
]