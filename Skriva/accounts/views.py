from django.shortcuts import render

# Create your views here.
def privacy_policy(request):
    return render(request, 'account/privacy.html')