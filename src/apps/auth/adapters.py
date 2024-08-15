# myapp/adapters.py
from urllib.parse import urljoin

from allauth.account.adapter import DefaultAccountAdapter

from apps.auth.urls import verify_email_path


class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        key = emailconfirmation.key
        base_url = f'{request.scheme}://{request.get_host()}'
        url = urljoin(base_url, f'{verify_email_path}{key}/')
        return url
