# myapp/adapters.py
from urllib.parse import urljoin

from allauth.account.adapter import DefaultAccountAdapter

from apps.auth.urls import verify_email_path

from django.conf import settings


class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        return urljoin(settings.FRONTEND_URL, f'{verify_email_path}/{emailconfirmation.key}/')

    def send_mail(self, template_prefix, email, context):
        if 'password_reset' in template_prefix:
            reset_password_path = 'auth/password/reset/confirm'  # Frontend reset password path
            # Construct the URL with 'uid' and 'token'
            reset_url = urljoin(
                settings.FRONTEND_URL,
                f'{reset_password_path}/{context["uid"]}/{context["token"]}/'
            )
            context['password_reset_url'] = reset_url

        super().send_mail(template_prefix, email, context)
