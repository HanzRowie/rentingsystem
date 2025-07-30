from django.urls import path
from accounts import views

urlpatterns = [
   path('register/',views.RegisterView.as_view(),name='register'),
   path('login/',views.LoginView.as_view(),name='login'),  
   path('profile/',views.ProfileViwe.as_view(),name='profile'),

]