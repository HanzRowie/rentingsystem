from django.urls import path
from ownerrooms.views import RoomView

urlpatterns = [
    path('roomview/', RoomView.as_view(), name='room_view'),
    path('roomview/<int:pk>/',RoomView.as_view(), name='room_detail'),
]