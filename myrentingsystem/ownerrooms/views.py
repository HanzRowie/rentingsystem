from django.shortcuts import render, get_object_or_404
from .models import Room
from ownerrooms.serializers import RoomSerializer
from rest_framework.views import APIView  
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from seeker.models import RoomRequest  # Import RoomRequest model
from seeker.serializers import RoomRequestSerializer  # Serializer for RoomRequest

# Define or import your custom permission IsOwner
from accounts.permissions import IsRoomOwner

# Create your views here.

class RoomView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, pk=None):
        user = request.user
        if pk is not None:
            room = get_object_or_404(Room, pk=pk, owner=user)  
            serializer = RoomSerializer(room)
        else:
            rooms = Room.objects.filter(owner=user)  
            serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)  # use 'owner' field
            return Response({'msg': 'Room successfully posted'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if pk is None:
            return Response({"error": "Room ID (pk) is required to update a room."}, status=status.HTTP_400_BAD_REQUEST)
        
        room = get_object_or_404(Room, pk=pk, owner=request.user) 
        serializer = RoomSerializer(room, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Room updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if pk is None:
            return Response({"error": "Room ID (pk) is required to update a room."}, status=status.HTTP_400_BAD_REQUEST)
        
        room = get_object_or_404(Room, pk=pk, owner=request.user)  # use 'owner' field
        serializer = RoomSerializer(room, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Room updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "Room ID (pk) is required to delete a room."}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(Room, pk=pk, owner=request.user)  
        room.delete()
        return Response({"msg": "Room deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class OwnerRoomRequestView(APIView):
    permission_classes = [IsAuthenticated, IsRoomOwner]  # You'll need an IsOwner permission

    def get(self, request):
        requests = RoomRequest.objects.filter(room__owner=request.user)
        serializer = RoomRequestSerializer(requests, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        room_request = get_object_or_404(RoomRequest, pk=pk, room__owner=request.user)
        new_status = request.data.get('status')

        if new_status not in ['approved', 'rejected']:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        room_request.status = new_status
        room_request.save()

        # If approved → mark room unavailable and reject other pending requests
        if new_status == 'approved':
            room = room_request.room
            room.available = False
            room.save()

            # Reject all other pending requests for this room
            RoomRequest.objects.filter(room=room, status='pending').exclude(pk=pk).update(status='rejected')

        return Response({"msg": f"Request {new_status} successfully."})

