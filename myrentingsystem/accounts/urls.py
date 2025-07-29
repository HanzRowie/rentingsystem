from django.urls import path
from accounts import views

urlpatterns = [
    path('profile/<int:user_id>/', views.profile, name='profile'),  
]