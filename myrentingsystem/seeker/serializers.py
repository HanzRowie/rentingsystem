from rest_framework import serializers
from .models import Seeker

class SeekerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seeker
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
