from django.shortcuts import render, get_object_or_404
from accounts.models import CustomUser, Profile
from django.contrib.auth import authenticate,login,logout
from accounts.serializers import RegisterSerializer, LoginSerializer, ProfileSerializers, UserChangePasswordSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.serializers import SendPasswordResetEmailSerializer, UserPasswordResetSerializer

from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(APIView):
    
    def post(self, request):
        try:
            data = request.data
            print("Received data:", data)  # Debug print
            
            serializer = RegisterSerializer(data=data)
            
            if not serializer.is_valid():
                print("Serializer errors:", serializer.errors)  # Debug print
                return Response({
                    'data': serializer.errors,
                    'message': 'Something went wrong'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response({
                'data': {},
                'message': "Your account was successfully created"
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Exception occurred:", str(e))  # Debug print
            return Response({
                'data': str(e),
                'message': "An error occurred"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self,request):
        try:
            serializer  =  LoginSerializer(data=request.data)
            if not serializer.is_valid():
                
                return Response({
                    'data':serializer.errors,
                    'message':'Something went wrong'
                },status=status.HTTP_400_BAD_REQUEST)
            
            token_response = serializer.get_jwt_token(serializer.validated_data)
            return Response(token_response,status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'data':{},
                'message':"An error occured"
            }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self,request):
        refresh_token = request.data.get('refresh_token')
        refresh_token = RefreshToken(refresh_token)
        refresh_token.blacklist()
        return Response({
            "message":"logged out successfully"
        },status=205)       

        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializers(profile)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self,request):
        if Profile.objects.filter(user=request.user).exists():
            return Response({'error':'Profile already exits'},status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProfileSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save(request.user)
            return Response({
                'msg':'Profile created successfully'
            },status=status.HTTP_201_CREATED)

        return Response(serializer.erros, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        profile = get_object_or_404(Profile,user=request.user)
        serializer = ProfileSerializers(profile,data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':"Profile Updated Successfully"},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self,request):
        profile = get_object_or_404(Profile,user = request.user)
        serializers = ProfileSerializers(profile,data = request.data, partial = True)
        if serializers.is_valid():
            serializers.save()
            return Response({'msg':"profile updated successfully"},status=status.HTTP_200_OK)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request):
        profile = get_object_or_404(Profile, user=request.user)
        profile.delete()
        return Response({
            "msg":"Profile successfully deleted"
        },status=status.HTTP_204_NO_CONTENT)
    

class  UserChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request,format = None):
        serializer  = UserChangePasswordSerializer(data = request.data, context = {'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password changed successfully'}, status=status.HTTP_200_OK)
        return  Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendPasswordResetEmail(APIView):
    permission_classes= [AllowAny]
    def post(self,request,format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({
                'msg':'Password Reset email sent successfully'
            },status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserPasswordReset(APIView):
    def post(self,request,uid,token,format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({
                'msg': 'Password reset successfully'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

