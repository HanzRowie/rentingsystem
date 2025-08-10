from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from  rest_framework.permissions import IsAuthenticated, AllowAny
from review.models import Review
from review.serializers import ReviewSerializer
from ownerrooms.models import Room
from seeker.models import RoomRequest
from rest_framework.views import APIView

# Create your views here.


class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
     
        has_requested = RoomRequest.objects.filter(
            seeker=request.user,
            room_id=room_id,
            status='approved'
        ).exists()

        if not has_requested:
            return Response(
                {"error": "You can only review rooms you have booked."},
                status=status.HTTP_403_FORBIDDEN
            )

       
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seeker=request.user, room_id=room_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self,request, room_id):
        review = get_object_or_404(Review,room_id = room_id, seeker=request.user)
        serializer = ReviewSerializer(review,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':"Review Updated Successfully"},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
