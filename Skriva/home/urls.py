from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('blogs/', views.blog_list, name='blog_list'),
    path('blogs/category/<slug:slug>/', views.blog_by_category, name='blog_by_category'),
    path('authors/', views.authors_list, name='authors_list'),
]