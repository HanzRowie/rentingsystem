from django.urls import path
from ownerrooms.views import RoomView, OwnerRoomRequestView

urlpatterns = [
    path('roomview/', RoomView.as_view(), name='room_view'),
    path('roomview/<int:pk>/',RoomView.as_view(), name='room_detail'),
    path('ownerroomrequests/', OwnerRoomRequestView.as_view(), name='owner_room_requests'),
]