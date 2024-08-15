from django.urls import path, re_path

from apps.auth.views.client import ClientView
from apps.auth.views.google_login import GoogleLogin

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
]
