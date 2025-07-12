from django import forms
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from .models import BlogPost, BlogCategory
from django_ckeditor_5.widgets import CKEditor5Widget

class BlogPostForm(forms.ModelForm):
    title = forms.CharField(
        max_length=200, 
        widget=forms.TextInput(attrs={
            'class': 'form-control', 
            'placeholder': 'Enter title here',
            'id': 'post-title'
        })
    )
    
    slug = forms.SlugField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'URL-friendly version of title',
            'id': 'post-slug'
        }),
        required=False
    )
    
    excerpt = forms.CharField(
        max_length=300,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Short description of your post',
            'rows': 3,
            'id': 'post-excerpt'
        }),
        required=False
    )
    
    content = forms.CharField(
        widget=CKEditor5Widget(config_name='extends', attrs={'class': 'django_ckeditor_5'}),
        required=False
    )
    
    featured_image = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'id': 'featured-image'
        })
    )
    
    category = forms.ModelChoiceField(
        queryset=BlogCategory.objects.all(),
        required=False,
        empty_label="Select a category (optional)",
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'post-category'
        })
    )
    
    status = forms.ChoiceField(
        choices=BlogPost.STATUS_CHOICES,
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'post-status'
        })
    )
    
    class Meta:
        model = BlogPost
        fields = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'category', 'status']
        
    def clean_slug(self):
        slug = self.cleaned_data.get('slug')
        title = self.cleaned_data.get('title')
        
        if not slug and title:
            slug = slugify(title)
            
        if BlogPost.objects.filter(slug=slug).exists():
            if self.instance.pk:
                if self.instance.slug != slug:
                    raise ValidationError("This slug is already in use. Please choose a different one.")
            else:
                raise ValidationError("This slug is already in use. Please choose a different one.")
                
        return slug
