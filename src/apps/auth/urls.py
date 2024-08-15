from django.urls import include, path, re_path

from apps.auth.views.client import ClientView
from apps.auth.views.google_login import GoogleLogin
from apps.auth.views.auth import SignupView, LoginView
from apps.auth.views.emails import ResendEmailVerificationView

app_name = 'auth'

urlpatterns = [
    path('', ClientView.as_view(), name='client'),
    path('loader/', ClientView.as_view(), name='loader'),
    path('auth/google/callback/', ClientView.as_view(), name='google_callback'),
    path('auth/signup/', ClientView.as_view(), name='signup'),
    path('auth/login/', ClientView.as_view(), name='login'),
    re_path('auth/confirm-email/(?P<key>.+)/', ClientView.as_view(), name='confirm_email'),
    path('auth/forgot-password/', ClientView.as_view(), name='forgot_password'),
    re_path('auth/reset-password/', ClientView.as_view(), name='reset_password'),
    path('profile/', ClientView.as_view(), name='profile'),
    path('profile/change-password/', ClientView.as_view(), name='change_password'),

    path('api/auth/google/', GoogleLogin.as_view(), name='google_auth'),
    path('api/auth/login/', LoginView.as_view(), name='rest_login'),
    path('api/auth/registration/', SignupView.as_view(), name='rest_register'),

    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    re_path(
        'api/auth/registration/resend-email-verification/',
        ResendEmailVerificationView.as_view(),
        name='resend_verification_email'
    ),
]
