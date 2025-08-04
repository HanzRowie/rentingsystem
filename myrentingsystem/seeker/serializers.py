from rest_framework import serializers
from .models import RoomRequest

class RoomRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
