from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from .models import CustomUser


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)
    conpassword =  serializers.CharField(write_only =  True)
    role  = serializers.CharField()

    def validate(self, data):
        if User.objects.filter(username  = data['username'].lower()).exists():
            raise serializers.ValidationError('Username is already taken')
        
        if User.objects.filter(email = data['email'].lower()).exists():
            raise serializers.ValidationError('Email is already taken')
        
        if data['password']!= data['conpassword']:
            raise serializers.ValidationError('Passwords do not match')
        
        allowed_roles = ['seeker','Room Owner']
        if data['role'].lower() not in allowed_roles:
            raise serializers.ValidationError(f"Invalid role. Allowed roles are: {', '.join(allowed_roles)}")
        
        return data
    
    def create(self, validated_data):
      validated_data.pop('conpassword')

      user = User.objects.create(
          username =   validated_data['username'],
          email = validated_data['email'],
          role= validated_data['role'].lower()
      )
      user.set_password(validated_data['password'])
      user.save()
      return user

