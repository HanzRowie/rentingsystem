from django.shortcuts import render, get_object_or_404
from ownerrooms.models import Room
from seeker.serializers import RoomRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from seeker.models import RoomRequest
from accounts.permissions import IsSeeker
from ownerrooms.serializers import RoomSerializer
from django.db.models import Q
from django.core.paginator import Paginator

class RoomRequestView(APIView):
    permission_classes = [IsAuthenticated, IsSeeker]

    def post(self, request, room_id):
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

    def put(self, request, pk=None):
        if pk is None:
            return Response({"error": "Room request ID (pk) is required to update a request."}, status=status.HTTP_400_BAD_REQUEST)
        
        if 'status' in request.data:
            return Response({"error": "You cannot update the status."}, status=status.HTTP_400_BAD_REQUEST)
        
        roomrequest = get_object_or_404(RoomRequest, pk=pk, seeker=request.user)
        serializer = RoomRequestSerializer(roomrequest, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Room request updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if pk is None:
            return Response({"error": "Room request ID (pk) is required to update a request."}, status=status.HTTP_400_BAD_REQUEST)
        
        if 'status' in request.data:
            return Response({"error": "You cannot update the status."}, status=status.HTTP_400_BAD_REQUEST)
        
        roomrequest = get_object_or_404(RoomRequest, pk=pk, seeker=request.user)
        serializer = RoomRequestSerializer(roomrequest, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Room request updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "Room request ID (pk) is required to delete a request."}, status=status.HTTP_400_BAD_REQUEST)
        
        roomrequest = get_object_or_404(RoomRequest, pk=pk, seeker=request.user)
        roomrequest.delete()
        return Response({"msg": "Room request deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class RoomListView(APIView):
    permission_classes = [IsAuthenticated, IsSeeker]

    def get(self, request):
        rooms = Room.objects.filter(available=True)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchRoomView(APIView):
    permission_classes = [IsAuthenticated, IsSeeker]

    def get(self, request):
        search_query = request.query_params.get('search', '')
        price = request.query_params.get('price', None)
        location = request.query_params.get('location', '')

        rooms = Room.objects.filter(available=True)

        # Filter by price if provided
        if price:
            try:
                price = int(price)
                rooms = rooms.filter(price__lte=price)
            except ValueError:
                return Response({"error": "Invalid price value."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter by location if provided
        if location:
            rooms = rooms.filter(location__icontains=location)

        # Filter by search query if provided
        if search_query:
            rooms = rooms.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(location__icontains=search_query)
            )

        # Pagination
        page_number = request.query_params.get('page', 1)
        paginator = Paginator(rooms, 2)
        page_obj = paginator.get_page(page_number)

        serializer = RoomSerializer(page_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class RoomSortView(APIView):
    permission_classes = [IsAuthenticated, IsSeeker]

    def get(self,request):
        sort_order = request.query_params.get('sort','newest')
        if sort_order == 'newest':
            rooms = Room.objects.filter(available=True).order_by('-created_at')
        elif sort_order == 'oldest':
            rooms = Room.objects.filter(available=True).order_by('created_at')
        elif sort_order == 'price_asc':
            rooms = Room.objects.filter(available=True).order_by('price')
        elif sort_order == 'price_desc':
            rooms = Room.objects.filter(available=True).order_by('-price')
        else:
            return Response({"error": "Invalid sort order."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
