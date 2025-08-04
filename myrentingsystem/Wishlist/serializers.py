from rest_framework import serializers
from Wishlist.models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'seeker', 'room', 'added_at']
        read_only_fields = ['id', 'added_at']

    def validate(self, data):
        if not data.get('room'):
            raise serializers.ValidationError("Room must be specified.")
        return data

    def create(self, validated_data):
        return Wishlist.objects.create(**validated_data)
    
    