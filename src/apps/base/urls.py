from django.urls import path, re_path

from apps.base.views.client import ClientView

app_name = "base"

urlpatterns = [
    path("", ClientView.as_view(), name="client"),
    path("signup/", ClientView.as_view(), name="signup"),
    re_path('signup/confirm-email/(?P<key>.+)/', ClientView.as_view(), name='confirm_email'),
]
