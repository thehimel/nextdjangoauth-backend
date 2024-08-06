from django.utils.translation import gettext_lazy as _
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from allauth.socialaccount.models import SocialAccount


class SocialAccountCheckMixin:
    @staticmethod
    def check_and_respond_if_social_account(request):
        email = request.data.get('email')
        if email:
            social_account = SocialAccount.objects.filter(user__email=email).first()
            if social_account:
                provider = social_account.provider.capitalize()
                return Response(
                    {
                        'code': 'email_registered_with_social_login',
                        'provider': provider,
                        'email': [_(f'This email is already registered with {provider} sign-in.'
                                    f' Please use {provider} to log in or use a different email.')]
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        return None


class EmailCheckMixin:
    @staticmethod
    def check_and_respond_if_email_registered(request):
        email = request.data.get('email')
        if email:
            if User.objects.filter(email=email).exists():
                return Response(
                    {
                        'code': 'email_registered_with_email_login',
                        'email': [_(f'This email is already registered with an email and password.'
                                    f' Please use your email and password to log in or use a different email.')]
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        return None
