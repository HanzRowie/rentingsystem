from django.shortcuts import render
from ownerrooms.models import Room
from seeker.serializers import RoomRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from seeker.models import RoomRequest
from accounts.permissions import IsSeeker


# Create your views here.
class RoomRequestView(APIView):
    permission_classes = [IsAuthenticated, IsSeeker]

    def post(self,request,room_id):
        try:
            room = Room.objects.get(id=room_id, available=True)
        except Room.DoesNotExist:
            return Response({"error": "Room not found or not available."}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoomRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seeker=request.user, room=room)
            return Response({"msg": "Room request submitted successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        requests = RoomRequest.objects.filter(seeker=request.user)
        serializer = RoomRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

            
