from rest_framework import serializers
from ownerrooms.models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'owner', 'title', 'description', 'location', 'price', 'available', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        if data['price'] <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return data

    def create(self, validated_data):
        return Room.objects.create(**validated_data)

