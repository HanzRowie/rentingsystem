from django.shortcuts import render
from accounts.models import CustomUser, Profile
from django.contrib.auth import authenticate,login,logout
from accounts.serializers import RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny


class RegisterView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = RegisterSerializer(data=data)
            
            if not serializer.is_valid():
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
            
            token_response = serializer.get_jwt_token(serializer.validate_data)
            return Response(token_response,status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'data':{},
                'message':"An error occured"
            }, status=status.HTTP_400_BAD_REQUEST)
        
class ProfileViwe(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        pass

