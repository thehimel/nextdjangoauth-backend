from allauth.socialaccount.models import SocialAccount
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.response import Response


class SocialAccountCheckMixin:
    @staticmethod
    def check_and_respond_if_social_account(request):
        email = request.data.get("email")
        if email:
            social_account = SocialAccount.objects.filter(user__email=email).first()
            if social_account:
                provider = social_account.provider.capitalize()
                return Response(
                    {
                        "code": "email_registered_with_social_login",
                        "provider": provider,
                        "email": [
                            _(
                                f"This email is already registered with {provider} sign-in."
                                f" Please use {provider} to log in or use a different email."
                            )
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return None
