from django.urls import include, path, re_path

from apps.auth.views.auth import LoginView, SignupView
from apps.auth.views.client import ClientView
from apps.auth.views.emails import ResendEmailVerificationView
from apps.auth.views.google_login import GoogleLogin

app_name = 'auth'

verify_email_path = 'auth/signup/verify-email'

urlpatterns = [
    path('', ClientView.as_view(), name='client'),
    path('loader/', ClientView.as_view(), name='loader'),

    path('auth/google/callback/', ClientView.as_view(), name='google_callback'),
    path('auth/login/', ClientView.as_view(), name='login'),
    path('auth/signup/', ClientView.as_view(), name='signup'),
    re_path(f'{verify_email_path}/(?P<key>.+)/', ClientView.as_view(), name='verify_email'),

    path('users/profile/', ClientView.as_view(), name='profile'),

    path('auth/password/reset/', ClientView.as_view(), name='password_reset'),
    path('auth/password/reset/confirm/<uidb64>/<token>/', ClientView.as_view(), name='password_reset_confirm'),
    path('auth/password/change/', ClientView.as_view(), name='password_change'),

    path('api/auth/google/', GoogleLogin.as_view(), name='google_auth'),
    path('api/auth/login/', LoginView.as_view(), name='rest_login'),
    path('api/auth/registration/', SignupView.as_view(), name='rest_register'),
    path('api/auth/', include('dj_rest_auth.urls')),

    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    re_path(
        'api/auth/registration/resend-email-verification/',
        ResendEmailVerificationView.as_view(),
        name='resend_verification_email'
    ),
]

