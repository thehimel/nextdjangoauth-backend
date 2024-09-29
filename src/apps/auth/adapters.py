# myapp/adapters.py
from urllib.parse import urljoin

from allauth.account.adapter import DefaultAccountAdapter

from apps.auth.urls import verify_email_path

from django.conf import settings


class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        return urljoin(settings.FRONTEND_URL, f'{verify_email_path}/{emailconfirmation.key}/')
