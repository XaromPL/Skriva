from django import forms
from allauth.account.forms import SignupForm, LoginForm
from django.utils.translation import gettext_lazy as _
from captcha.fields import CaptchaField

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
