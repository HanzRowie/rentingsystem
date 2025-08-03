from django.urls import path
from accounts import views

urlpatterns = [
    path('roomview/', views.RoomView.as_view(), name='room_view'),
    path('roomview/<int:pk>/', views.RoomView.as_view(), name='room_detail'),
]