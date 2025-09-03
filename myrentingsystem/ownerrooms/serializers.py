from rest_framework import serializers
from ownerrooms.models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'owner', 'title', 'description', 'location', 'price', 'room_type', 'available', 'is_approved', 'created_at', 'photo']
        read_only_fields = ['id', 'created_at', 'is_approved', 'owner']

    def validate(self, data):
        if data['price'] <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return data

    def create(self, validated_data):
        # The owner will be set in the view
        return Room.objects.create(**validated_data)

