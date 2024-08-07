import requests
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from google.auth.exceptions import GoogleAuthError
from rest_framework import status
from rest_framework.response import Response


class EmailCheckMixin:
    @staticmethod
    def check_and_respond_if_email_registered(request):
        access_token = request.data.get("access_token")

        if not access_token:
            return Response(
                {"code": "access_token_missing", "error": [_("Access token is required.")]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_info_response = requests.get(
                "https://www.googleapis.com/oauth2/v1/userinfo", params={"access_token": access_token}
            )
            user_info_response.raise_for_status()
            user_info = user_info_response.json()
            email = user_info.get("email")

            if email is None:
                return Response(
                    {"code": "email_not_found_in_token", "error": [_("Email not found in token.")]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            social_account = SocialAccount.objects.filter(user__email=email).first()
            if social_account:
                return None

            # Check if the email is registered with a traditional user account
            user_models = get_user_model()
            if user_models.objects.filter(email=email).exists():
                return Response(
                    {
                        "code": "email_registered_with_email_login",
                        "email": [
                            _(
                                "This email is already registered with an email and password."
                                " Please use your email and password to log in or use a different email."
                            )
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except ValueError as e:
            return Response(
                {"code": "invalid_token", "error": [_(f"Invalid token: {str(e)}")]}, status=status.HTTP_400_BAD_REQUEST
            )
        except GoogleAuthError as e:
            # Catch errors from Google authentication library
            return Response(
                {"code": "google_auth_error", "error": [_(f"Google authentication error: {str(e)}")]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"code": "token_verification_error", "error": [_(f"Error verifying token: {str(e)}")]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return None
