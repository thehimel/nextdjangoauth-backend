from dj_rest_auth.views import LoginView as MainLoginView
from dj_rest_auth.registration.views import RegisterView as MainRegisterView
from apps.base.mixins import SocialAccountCheckMixin


class LoginView(SocialAccountCheckMixin, MainLoginView):
    def post(self, request, *args, **kwargs):
        response = self.check_and_respond_if_social_account(request)
        if response:
            return response
        return super().post(request, *args, **kwargs)


class SignupView(SocialAccountCheckMixin, MainRegisterView):
    def create(self, request, *args, **kwargs):
        response = self.check_and_respond_if_social_account(request)
        if response:
            return response
        return super().create(request, *args, **kwargs)
