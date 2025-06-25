from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

# Create your views here.
def privacy_policy(request):
    return render(request, 'account/privacy.html')

def profile(request):
    return render(request, 'account/profile.html')

@login_required
def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    is_own_profile = request.user.username == username
    
    context = {
        'profile_user': user,
        'is_own_profile': is_own_profile
    }
    
    return render(request, 'account/user_profile.html', context)