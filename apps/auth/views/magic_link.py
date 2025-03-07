import secrets
import string

from allauth.socialaccount.models import SocialAccount
from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from sesame.utils import get_token
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework.parsers import JSONParser
from sesame.utils import get_user  # Import Sesame's get_user to manually verify the token


class MagicLinkRequestSerializer(serializers.Serializer):
    """
    Serializer for Magic Link request input
    """
    email = serializers.EmailField(help_text="The email address associated with the user.")


class MagicLinkResponseSerializer(serializers.Serializer):
    """
    Serializer for Magic Link request success response
    """
    message = serializers.CharField(help_text="Magic link sent successfully.")


class MagicLinkErrorResponseSerializer(serializers.Serializer):
    """
    Serializer for Magic Link request error response
    """
    error = serializers.CharField(help_text="Error message for bad requests.")


class VerifyMagicLinkRequestSerializer(serializers.Serializer):
    """
    Serializer for Magic Link verification input
    """
    token = serializers.CharField(help_text="Token embedded in the magic link for verification.")


class VerifyMagicLinkResponseSerializer(serializers.Serializer):
    """
    Serializer for Magic Link verification success response
    """
    access = serializers.CharField(help_text="JWT access token")
    refresh = serializers.CharField(help_text="JWT refresh token")
    user = serializers.DictField(help_text="User details including ID, username, and email.")


User = get_user_model()


class MagicLinkView(APIView):
    """
    API endpoint for requesting a magic link authentication.
    """
    permission_classes = []

    @swagger_auto_schema(
        operation_id="request_magic_link",
        operation_description="Request a magic link for authentication by providing a valid email address.",
        request_body=MagicLinkRequestSerializer,
        responses={
            200: MagicLinkResponseSerializer(),
            400: MagicLinkErrorResponseSerializer(),
        },
    )
    def post(self, request):
        serializer = MagicLinkRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user exists with this email
        user_exists = User.objects.filter(email=email).exists()

        # If user exists, check if they're registered with a social provider
        if user_exists:
            user = User.objects.get(email=email)
            social_accounts = SocialAccount.objects.filter(user=user)

            if social_accounts.exists():
                # User is registered with a social provider
                provider = social_accounts.first().provider
                return Response(
                    {
                        "code": "email_registered_with_social_login",
                        "provider": provider,
                        "email": [
                            f"This email is already registered with {provider} sign-in. Please use {provider} to log in or use a different email."
                        ]
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Generate a strong random password
            password_chars = string.ascii_letters + string.digits + string.punctuation
            password = ''.join(secrets.choice(password_chars) for i in range(20))

            # Create the user with blank name using the User model's create_user method
            # This matches how dj-rest-auth creates users and properly hashes passwords
            user = User.objects.create_user(
                email=email,
                username=email,  # Using email as username
                password=password,
            )

            user.first_name = ''
            user.last_name = ''
            user.save()

            # Create an EmailAddress object for Allauth
            EmailAddress.objects.create(user=user, email=email, verified=True, primary=True)

        # Generate a magic link token for the user
        token = get_token(user)
        magic_link = f"{settings.NEXT_FRONTEND_URL}/auth/signin?{settings.SESAME_TOKEN_NAME}={token}"

        # Prepare email context
        context = {
            'user': user,
            'token': token,
            'magic_link': magic_link,
            'brand_name': settings.BRAND_NAME,
        }

        # Send the magic link email
        subject = f"Your {settings.BRAND_NAME} Login Link"
        html_message = render_to_string('auth/magic_link_email.html', context)
        plain_message = render_to_string('auth/magic_link_email.txt', context)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
        )

        return Response(
            {'message': 'Magic link sent successfully.'},
            status=status.HTTP_200_OK
        )


class VerifyMagicLinkView(APIView):
    """
    API endpoint for verifying magic link and returning JWT tokens using POST method.
    """
    permission_classes = []
    parser_classes = [JSONParser]  # Allow JSON payload in the request body

    @swagger_auto_schema(
        operation_id="verify_magic_link",
        operation_description="Verifies a magic link token and returns access/refresh tokens or error.",
        request_body=VerifyMagicLinkRequestSerializer,
        responses={
            200: VerifyMagicLinkResponseSerializer(),
            400: MagicLinkErrorResponseSerializer(),
        },
    )
    def post(self, request):
        serializer = VerifyMagicLinkRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        sesame_token = serializer.validated_data['token']

        if not sesame_token:
            return Response(
                {"token": ["Token is required."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Manually verify the Sesame token
        user = get_user(sesame_token)

        if user is None:
            return Response(
                {"token": ["Invalid or expired token."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # Format response to match dj-rest-auth
        response_data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "pk": user.pk,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)
