from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

from apps.auth.mixins import EmailCheckMixin


class GoogleLogin(EmailCheckMixin, SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    def post(self, request, *args, **kwargs):
        # Check if the email is registered with a traditional email and password before proceeding
        response = self.check_and_respond_if_email_registered(request)
        if response:
            return response

        # Proceed with the normal flow if the email is not registered with a traditional account
        return super().post(request, *args, **kwargs)
