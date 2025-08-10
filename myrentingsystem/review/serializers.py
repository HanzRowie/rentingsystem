from rest_framework import serializers
from review.models import Review

class ReviewSerializer(serializers.ModelSerializer):
    seeker = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'room', 'seeker', 'rating', 'comment', 'create_at']
        read_only_fields = ['id', 'create_at', 'seeker', 'room']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
