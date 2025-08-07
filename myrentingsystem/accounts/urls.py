from django.urls import path
from accounts import views

urlpatterns = [
   path('register/',views.RegisterView.as_view(),name='register'),
   path('login/',views.LoginView.as_view(),name='login'),  
   path('profile/',views.ProfileView.as_view(),name='profile'),
   path('logout/',views.LogoutView.as_view(),name='logout'),
   path('changepassword/', views.UserChangePasswordView.as_view(), name='changepassword'),
   path('UserPasswordResetView/<uid>/<token>/', views.UserPasswordResetView.as_view(), name='UserPasswordResetView'),
   path('SendPasswordResetEmai/', views.SendPasswordResetEmailView.as_view(), name='SendPasswordResetEmail')
]
