from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from django_ckeditor_5.fields import CKEditor5Field

class BlogCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('blog_category', kwargs={'slug': self.slug})


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200, help_text="Enter blog post title")
    slug = models.SlugField(max_length=200, unique=True, help_text="URL-friendly version of title")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    content = CKEditor5Field('Text', config_name='extends', help_text="Blog post content with rich text formatting")
    excerpt = models.TextField(max_length=300, blank=True, help_text="Short description of the post")
    featured_image = models.ImageField(upload_to='blog_images/', blank=True, null=True, help_text="Main image for the blog post")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog_detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    @property
    def is_published(self):
        return self.status == 'published'
    
    def is_liked_by_user(self, user):
        if not user.is_authenticated:
            return False
        return self.user_likes.filter(user=user).exists()
    
    def toggle_like(self, user):
        if not user.is_authenticated:
            return False
        
        like, created = BlogLike.objects.get_or_create(user=user, post=self)
        if not created:
            like.delete()
            self.likes_count = max(0, self.likes_count - 1)
            liked = False
        else:
            self.likes_count += 1
            liked = True
        
        self.save(update_fields=['likes_count'])
        return liked


class BlogLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='user_likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'post')
        verbose_name = 'Blog Like'
        verbose_name_plural = 'Blog Likes'
    
    def __str__(self):
        return f'{self.user.username} likes {self.post.title}'
