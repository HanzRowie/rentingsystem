from django.shortcuts import render, get_object_or_404
from .models import Room
from ownerrooms.serializers import RoomSerializer
from rest_framework.views import APIView  
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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
