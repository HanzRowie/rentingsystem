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
        notification =  Notification.objects.filter(user = request.user).order_by('-created_at')
        serializer = NotificationSerializer(notification, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

