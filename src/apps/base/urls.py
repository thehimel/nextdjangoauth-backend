from django.urls import path, re_path

from apps.base.views.client import ClientView

app_name = 'base'

urlpatterns = [
    path('', ClientView.as_view(), name='client'),
    path('signup/', ClientView.as_view(), name='signup'),
    path('login/', ClientView.as_view(), name='login'),
    re_path('signup/confirm-email/(?P<key>.+)/', ClientView.as_view(), name='confirm_email'),
    re_path('profile/', ClientView.as_view(), name='profile'),
]
