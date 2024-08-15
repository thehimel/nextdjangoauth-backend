from django.urls import path, re_path

from apps.auth.views.client import ClientView
from apps.auth.views.google_login import GoogleLogin

app_name = 'auth'

urlpatterns = [
    # Client
    path('', ClientView.as_view(), name='client'),
    path('signup/', ClientView.as_view(), name='signup'),
    path('login/', ClientView.as_view(), name='login'),
    path('loader/', ClientView.as_view(), name='loader'),
    re_path('signup/confirm-email/(?P<key>.+)/', ClientView.as_view(), name='confirm_email'),
    path('recovery/forgot-password/', ClientView.as_view(), name='forgot_password'),
    re_path('recovery/reset-password/', ClientView.as_view(), name='reset_password'),
    path('profile/', ClientView.as_view(), name='profile'),
    path('profile/change-password/', ClientView.as_view(), name='change_password'),
    path('auth/google/callback/', ClientView.as_view(), name='google_callback'),
    # Server
    path('api/auth/google/', GoogleLogin.as_view(), name='google_auth'),
]
