# myapp/adapters.py
from allauth.account.adapter import DefaultAccountAdapter


class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        key = emailconfirmation.key
        # Use the request's scheme and host to construct the URL
        url = f'{request.scheme}://{request.get_host()}/auth/confirm-email/{key}/'
        return url
