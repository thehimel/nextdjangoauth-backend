from django.urls import path

from apps.base.views.client import ClientView

app_name = "base"

urlpatterns = [
    path("", ClientView.as_view(), name="client"),
]
