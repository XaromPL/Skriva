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
    
    context = {
        'profile_user': user,
        'profile': profile,
        'is_own_profile': is_own_profile,
    }
    
    return render(request, 'account/user_profile.html', context)

@login_required
def settings(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
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