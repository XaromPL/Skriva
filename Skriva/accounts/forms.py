from django import forms
from allauth.account.forms import SignupForm
from django.utils.translation import gettext_lazy as _

class CustomSignupForm(SignupForm):
    terms_agreement = forms.BooleanField(
        required=True,
        label=_("I accept the terms and privacy policy"),
        error_messages={
            'required': _("You must accept the terms and conditions to register.")
        }
    )
    def __init__(self, *args, **kwargs):
        super(CustomSignupForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = _("Username")
        self.fields['email'].label = _("Email Address")
        self.fields['password1'].label = _("Password")
        self.fields['password2'].label = _("Password (again)")
        
        self.fields.keyOrder = [
            'username',
            'email',
            'password1',
            'password2',
            'terms_agreement'
        ]

    def save(self, request):
        user = super(CustomSignupForm, self).save(request)
        return user
