from django import forms
from allauth.account.forms import SignupForm, LoginForm
from django.utils.translation import gettext_lazy as _
from captcha.fields import CaptchaField
from .models import UserProfile
from django.contrib.auth.models import User

class CustomSignupForm(SignupForm):
    terms_agreement = forms.BooleanField(
        required=True,
        label=_("I accept the terms and privacy policy"),
        error_messages={
            'required': _("You must accept the terms and conditions to register.")
        }
    )
    captcha = CaptchaField(
        label=_("Verification"),
        error_messages={
            'required': _("Please enter the captcha verification code."),
            'invalid': _("Invalid captcha, please try again.")
        }
    )

    def __init__(self, *args, **kwargs):
        super(CustomSignupForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = _("Username")
        self.fields['email'].label = _("Email Address")
        self.fields['password1'].label = _("Password")
        self.fields['password2'].label = _("Password (again)")
        self.field_order = [
            'username',
            'email',
            'password1',
            'password2',
            'terms_agreement',
            'captcha'
        ]

    def save(self, request):
        user = super(CustomSignupForm, self).save(request)
        return user


class CustomLoginForm(LoginForm):
    captcha = CaptchaField(
        label=_("Verification"),
        error_messages={
            'required': _("Please enter the captcha verification code."),
            'invalid': _("Invalid captcha, please try again.")
        }
    )

    def __init__(self, *args, **kwargs):
        super(CustomLoginForm, self).__init__(*args, **kwargs)
        self.fields['login'].label = _("Username or Email")
        self.fields['password'].label = _("Password")
        self.fields['remember'].label = _("Remember Me")
        self.field_order = [
            'login',
            'password',
            'remember',
            'captcha'
        ]


class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=False, label=_('First Name'))
    last_name = forms.CharField(max_length=30, required=False, label=_('Last Name'))

    class Meta:
        model = UserProfile
        fields = ('profile_image', 'banner_image', 'birth_date', 'bio')
        labels = {
            'profile_image': _('Profile Picture'),
            'banner_image': _('Banner'),
            'birth_date': _('Date of Birth'),
            'bio': _('Profile Description'),
        }
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date'}),
            'bio': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.user:
            self.fields['first_name'].initial = self.instance.user.first_name
            self.fields['last_name'].initial = self.instance.user.last_name

    def save(self, commit=True):
        profile = super().save(commit=False)
        profile.user.first_name = self.cleaned_data['first_name']
        profile.user.last_name = self.cleaned_data['last_name']
        
        # Sprawdź, czy w danych z żądania są pola remove_profile_image lub remove_banner_image
        if hasattr(self, 'data') and 'remove_profile_image' in self.data:
            profile.profile_image = None
        
        if hasattr(self, 'data') and 'remove_banner_image' in self.data:
            profile.banner_image = None
            
        if commit:
            profile.user.save()
            profile.save()
        return profile
