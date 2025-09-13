from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from .models import Notification
from .serializers  import NotificationSerializer

# Create your views here.


class NotificationListView(APIView):
    permission_classes =  [permissions.IsAuthenticated]

    def get(self, request):
        print(f"=== FETCH NOTIFICATIONS REQUEST ===")
        print(f"Fetching notifications for user: {request.user.username}")
        notification =  Notification.objects.filter(user = request.user).order_by('-created_at')
        print(f"Found {notification.count()} notifications")
        
        # Log each notification's read status from database
        for notif in notification:
            print(f"DB - Notification {notif.id}: is_read = {notif.is_read}")
        
        serializer = NotificationSerializer(notification, many=True)
        print(f"Serialized data: {serializer.data}")
        print(f"=== END FETCH NOTIFICATIONS REQUEST ===")
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, pk):
        print(f"=== MARK READ REQUEST ===")
        print(f"Marking notification {pk} as read for user {request.user.username}")
        print(f"Request data: {request.data}")
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            print(f"Found notification: {notification.id} - {notification.message}")
            print(f"Current is_read status: {notification.is_read}")
        except Notification.DoesNotExist:
            print(f"Notification {pk} not found for user {request.user.username}")
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
        
        notification.is_read = True
        notification.save()
        print(f"Successfully marked notification {pk} as read")
        print(f"New is_read status: {notification.is_read}")
        serializer = NotificationSerializer(notification)
        print(f"Serialized data: {serializer.data}")
        print(f"=== END MARK READ REQUEST ===")
        return Response(serializer.data, status=status.HTTP_200_OK)
