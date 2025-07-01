from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.utils import timezone
from .models import BlogPost, BlogCategory
from .forms import BlogPostForm

@login_required
def blog_editor(request, slug=None):

    post = None
    if slug:
        post = get_object_or_404(BlogPost, slug=slug)
        if post.author != request.user:
            return HttpResponseForbidden("You don't have permission to edit this post.")
    
    if request.method == 'POST':
        form = BlogPostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            blog_post = form.save(commit=False)
            if not post:
                blog_post.author = request.user
            
            if blog_post.status == 'published' and not blog_post.published_at:
                blog_post.published_at = timezone.now()
                
            blog_post.save()
            return redirect('my_blog_posts')
    else:
        form = BlogPostForm(instance=post)
    
    context = {
        'form': form,
        'post': post,
        'is_edit': slug is not None
    }
    return render(request, 'blog/editor.html', context)

@login_required
def delete_post(request, slug):

    post = get_object_or_404(BlogPost, slug=slug)
    
    if post.author != request.user:
        return HttpResponseForbidden("You don't have permission to delete this post.")

    post.delete()
    return redirect('/')
        
    return render(request, 'blog/confirm_delete.html', {'post': post})

def blog_post_detail(request, slug):

    post = get_object_or_404(BlogPost, slug=slug)
    
    post.views_count += 1
    post.save(update_fields=['views_count'])
    
    context = {
        'post': post,
        'is_author': request.user == post.author if request.user.is_authenticated else False
    }
    return render(request, 'blog/blog_detail.html', context)

@login_required
def user_blog_posts(request, username=None):
    from django.contrib.auth.models import User
    
    if username:
        user = get_object_or_404(User, username=username)
    else:
        user = request.user
        
    posts = BlogPost.objects.filter(author=user).order_by('-created_at')
    context = {
        'posts': posts,
        'author': user,
        'is_author': request.user == user
    }
    return render(request, 'blog/user_posts.html', context)
