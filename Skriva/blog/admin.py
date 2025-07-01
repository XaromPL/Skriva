from django.contrib import admin
from .models import BlogCategory, BlogPost

# Register your models here.

admin.site.register(BlogCategory)
admin.site.register(BlogPost)