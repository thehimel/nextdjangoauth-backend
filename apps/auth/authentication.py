# First, create a custom authentication class in apps/auth/authentication.py:

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from sesame.utils import get_user


class SesameAuthentication(authentication.BaseAuthentication):
    """
    Authentication backend that uses django-sesame to authenticate via URL tokens.
    """

    def authenticate(self, request):
        # Get the user from the token (sesame will handle token extraction)
        user = get_user(request)

        if user is None:
            return None  # No token or invalid token

        if not user.is_active:
            raise AuthenticationFailed('User inactive or deleted')

        return user, None  # (user, auth) tuple as expected by DRF
