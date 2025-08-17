from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from .models import CustomUser, Profile
from django.contrib.auth import get_user_model
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from  django.utils.http import  urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from accounts.utils  import Utils
User = get_user_model()

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)
    password2 = serializers.CharField(write_only = True)
    role = serializers.CharField()

    def validate(self, data):
        if User.objects.filter(username = data['username'].lower()).exists():
            raise serializers.ValidationError('Username is already taken')
        
        if User.objects.filter(email = data['email'].lower()).exists():
            raise serializers.ValidationError('Email is already taken')
        
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords do not match')
        
        # Accept only seeker or room owner (case-insensitive)
        allowed_roles_lower = ['seeker', 'room owner']
        if data['role'].lower() not in allowed_roles_lower:
            readable_roles = 'Seeker, Room Owner'
            raise serializers.ValidationError(f"Invalid role. Allowed roles are: {readable_roles}")
        
        return data
    
    def create(self, validated_data):
        # Remove password2 before creating user
        validated_data.pop('password2')

        user = User.objects.create(
            username = validated_data['username'].lower(),
            email = validated_data['email'].lower(),
            role = validated_data['role'].lower()
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Invalid username or password')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')

        data['user'] = user
        return data

    def get_jwt_token(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email
            },
            'role': getattr(user, 'role', 'user')
        }

class ProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        

class UserChangePasswordSerializer(serializers.Serializer):
    password  = serializers.CharField(max_length=128, write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(max_length=128, write_only=True, style={'input_type': 'password'})
    class Meta:
        fields = ('password', 'password2')
    def validate(self, attrs):
        password =  attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
        user.set_password(password)
        user.save()
        return attrs
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        fields = ('email',)

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            link  =  'http://localhost:3000/api/user/reset'+uid+'/'+token
            body = 'Click the link below to reset your password:\n' + link
            data = {
                'subject': 'Reset Your Password',
                'body': body,
                'to_email': user.email
            }
            Utils.send_email(data)
            return attrs
        else:
            raise serializers.ValidationError("User with this email does not exist")
    

class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128,write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(max_length=128,write_only=True, style={'input_type': 'password'})

    class Meta:
        fields = ('password', 'password2')

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        uid = self.context.get('uid')
        token = self.context.get('token')
        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
        
        try:
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError("Token is invalid or has expired")
            user.set_password(password)
            user.save()
        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError("Token is invalid or has expired")
        return attrs
        

