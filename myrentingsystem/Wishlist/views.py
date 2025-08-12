from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from Wishlist.models import Wishlist
from Wishlist.serializers import WishlistSerializer
from accounts.permissions import IsSeeker
from ownerrooms.models import Room 
from rest_framework.pagination import PageNumberPagination  




class WishlistPagination(PageNumberPagination):
    page_size = 5  
    page_size_query_param = 'page_size'  
    max_page_size = 20


class WishlistView(APIView):
    permission_classes = [IsAuthenticated, IsSeeker]

    def get(self, request):
        wishlist = Wishlist.objects.filter(seeker=request.user)
        serializers = WishlistSerializer(wishlist, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

    def post(self, request, room_id):
        room = get_object_or_404(Room, id=room_id, available=True)
        wishlist_item, created = Wishlist.objects.get_or_create(seeker=request.user, room=room)
        if not created:
            return Response({"error": "This room is already in your wishlist."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = WishlistSerializer(wishlist_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, room_id):
        wishlist_item = get_object_or_404(Wishlist, seeker=request.user, room__id=room_id)
        wishlist_item.delete()
        return Response({"msg": "Room removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
