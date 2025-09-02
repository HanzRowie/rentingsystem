from django.urls import path
from accounts import views

urlpatterns = [
  
   path('register/',views.RegisterView.as_view(),name='register'),
   path('login/',views.LoginView.as_view(),name='login'),  
   path('profile/',views.ProfileView.as_view(),name='profile'),
   path('refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
   path('logout/',views.LogoutView.as_view(),name='logout'),
   path('changepassword/', views.UserChangePasswordView.as_view(), name='changepassword'),
   path('UserPasswordResetView/<uid>/<token>/', views.UserPasswordReset.as_view(), name='UserPasswordResetView'),
   path('SendPasswordResetEmai/', views.SendPasswordResetEmail.as_view(), name='SendPasswordResetEmail')
]
