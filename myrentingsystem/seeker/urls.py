from django.urls import path
from seeker.views import RoomRequestView, RoomListView

urlpatterns = [
    path('room-request/', RoomRequestView.as_view(), name='room_request_list'),  
    path('room-request/<int:room_id>/submit/', RoomRequestView.as_view(), name='room_request_submit'),  
    path('room-request/<int:pk>/', RoomRequestView.as_view(), name='room_request_detail'),  
    path('room-list/', RoomListView.as_view(), name='room_list'),
]
