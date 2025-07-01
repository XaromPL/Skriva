from django.urls import path
from . import views

urlpatterns = [
    path('editor/', views.blog_editor, name='blog_editor'),
    path('editor/<slug:slug>/', views.blog_editor, name='edit_blog_post'),
    path('post/<slug:slug>/', views.blog_post_detail, name='blog_post_detail'),
    path('post/<slug:slug>/delete/', views.delete_post, name='delete_post'),
    path('my-posts/', views.user_blog_posts, name='my_blog_posts'),
    path('user/<str:username>/posts/', views.user_blog_posts, name='user_blog_posts'),
]