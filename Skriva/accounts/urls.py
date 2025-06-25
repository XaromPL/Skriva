from django.urls import path, include
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('privacy', views.privacy_policy, name='privacy_policy'),
    path('', include('allauth.urls')),
    path('profile', views.profile, name='profile'),
    path('user/<str:username>/', views.user_profile, name='user_profile'),
]