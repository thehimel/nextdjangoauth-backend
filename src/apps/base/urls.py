from django.urls import path, re_path

from apps.base.views.client import ClientView

app_name = 'base'

urlpatterns = [
    path('', ClientView.as_view(), name='client'),
    path('signup/', ClientView.as_view(), name='signup'),
    path('login/', ClientView.as_view(), name='login'),
    path('loader/', ClientView.as_view(), name='loader'),
    re_path('signup/confirm-email/(?P<key>.+)/', ClientView.as_view(), name='confirm_email'),
    re_path('recovery/forgot-password/', ClientView.as_view(), name='forgot_password'),
    re_path('recovery/reset-password/', ClientView.as_view(), name='reset_password'),
    re_path('profile/', ClientView.as_view(), name='profile'),
    re_path('profile/change-password', ClientView.as_view(), name='change_password'),
]
