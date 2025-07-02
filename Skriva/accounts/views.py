from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import UserProfileForm
from .models import UserProfile

# Create your views here.
def privacy_policy(request):
    return render(request, 'account/privacy.html')

def profile(request):
    return render(request, 'account/profile.html')

@login_required
def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    is_own_profile = request.user.username == username
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    from blog.models import BlogPost
    blog_posts = BlogPost.objects.filter(author=user).order_by('-created_at')[:3]
    
    context = {
        'profile_user': user,
        'profile': profile,
        'is_own_profile': is_own_profile,
        'blog_posts': blog_posts,
    }
    
    return render(request, 'account/user_profile.html', context)

@login_required
def settings(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        if 'remove_profile_image' in request.POST and profile.profile_image:
            old_image = profile.profile_image
            profile.profile_image = None
            profile.save()
            if old_image:
                old_image.delete(save=False)
            messages.success(request, 'Profile picture has been removed.')
        
        if 'remove_banner_image' in request.POST and profile.banner_image:
            old_banner = profile.banner_image
            profile.banner_image = None
            profile.save()
            if old_banner:
                old_banner.delete(save=False)
            messages.success(request, 'Banner has been removed.')
            
        form = UserProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated successfully.')
            return redirect('settings')
    else:
        form = UserProfileForm(instance=profile)
    
    context = {
        'form': form,
        'profile': profile
    }
    
    return render(request, 'account/settings.html', context)