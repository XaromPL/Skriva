from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db import models
from blog.models import BlogPost, BlogCategory
from django.contrib.auth.models import User

def index(request):
    return render(request, 'home/index.html', {})

def about(request):
    return render(request, 'home/about.html', {})

def blog_list(request):
    posts = BlogPost.objects.filter(status='published').order_by('-published_at', '-created_at')
    
    paginator = Paginator(posts, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = BlogCategory.objects.all()
    
    context = {
        'posts': page_obj,
        'categories': categories,
        'page_title': 'All Blog Posts',
        'page_subtitle': 'Discover amazing stories from our community'
    }
    return render(request, 'home/blog_list.html', context)

def blog_by_category(request, slug):
    category = get_object_or_404(BlogCategory, slug=slug)
    posts = BlogPost.objects.filter(
        category=category, 
        status='published'
    ).order_by('-published_at', '-created_at')

    paginator = Paginator(posts, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = BlogCategory.objects.all()
    
    context = {
        'posts': page_obj,
        'categories': categories,
        'current_category': category,
        'page_title': f'{category.name} Posts',
        'page_subtitle': category.description or f'Posts in {category.name} category'
    }
    return render(request, 'home/blog_list.html', context)

def authors_list(request):
    authors = User.objects.filter(
        blog_posts__status='published'
    ).distinct().annotate(
        posts_count=models.Count('blog_posts', filter=models.Q(blog_posts__status='published'))
    ).order_by('-posts_count', 'username')
    
    paginator = Paginator(authors, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'authors': page_obj,
        'page_title': 'Authors',
        'page_subtitle': 'Meet our talented writers'
    }
    return render(request, 'home/authors_list.html', context)