from django.utils.translation import gettext_lazy as _

from dj_rest_auth.registration.views import ResendEmailVerificationView as MainResendEmailVerificationView, ConfirmEmailView as MainConfirmEmailView
from rest_framework.response import Response
from rest_framework import status
from allauth.account.models import EmailAddress


class ResendEmailVerificationView(MainResendEmailVerificationView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            email_address = EmailAddress.objects.filter(email=email).last()
            if not email_address:
                raise EmailAddress.DoesNotExist

            if email_address.verified:
                return Response(
                    {
                        'code': 'email_already_verified',
                        'email': [_('Email is already verified.')],
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Proceed with resending the verification email
                return super().post(request, *args, **kwargs)
        except EmailAddress.DoesNotExist:
            return Response(
                {
                    'code': 'email_not_found',
                    'email': [_('Email not found.')],
                },
                status=status.HTTP_404_NOT_FOUND
            )
