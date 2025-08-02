from django.shortcuts import render, get_object_or_404
from .models import Room
from ownerrooms.serializers import RoomSerializer
from rest_framework import ApiView, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class RoomView(ApiView):
    permission_class = [IsAuthenticated]
    def get(self,request,pk = None):
        user = request.user
        if pk is not None:
            room = get_object_or_404(Room,pk=pk, user=user)
            serializer = RoomSerializer(room)
        else:
            room = Room.objects.filter(user=user)
            serializer = RoomSerializer(room, many = True)

        return Response(serializer.data)
      
    def post(self,request):
        serializer = RoomSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'msg':'Room successfully posted'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        room = get_object_or_404(Room, user=request.user)
        serializers = RoomSerializer(room,data = request.data)
        if serializers.is_valid():
            serializers.save()
            return Response({'msg':"Your rooms is successfully Updated"},status=status.HTTP_200_OK)
        else:
            return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)
        
    
    def patch(self,request):
        room = get_object_or_404(Room,user = request.user)
        serializer = RoomSerializer(room,data=request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Your Room is successfully updated'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        if pk is None:
            return Response(
                {"error": "Room ID (pk) is required to delete a room."},
                status=status.HTTP_400_BAD_REQUEST
            )

        room = get_object_or_404(Room, pk=pk, user=request.user)
        room.delete()
        return Response(
            {"msg": "Room deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )

    
        
