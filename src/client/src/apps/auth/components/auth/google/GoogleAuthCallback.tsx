import Loader from "@/apps/base/components/ui/Loader.tsx";
import {EMAIL_REGISTERED_WITH_EMAIL_LOGIN} from "@/apps/auth/constants/errorCodes.ts";
import {LOGIN_URL} from "@/apps/auth/urls/client.ts";
import {HOME_URL} from "@/apps/base/urls/client.ts";
import {googleAuth} from "@/store/auth/actions/googleAuth.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

const GoogleAuthCallback: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const from = location.state?.from?.pathname || HOME_URL;

  const hash = location.hash;
  const access_token = new URLSearchParams(hash.replace('#', '?')).get('access_token');

  useEffect(() => {
    const verifyToken = async  () => {
      if (access_token) {
        const response = await dispatch(googleAuth({access_token}));
        const emailRegisteredWithEmailLogin = response.errors?.code === EMAIL_REGISTERED_WITH_EMAIL_LOGIN;

        if (response.success) {
          navigate(HOME_URL);
        } else if (emailRegisteredWithEmailLogin) {
          navigate(LOGIN_URL);
          toast.error(t("errors.emailRegisteredWithEmailLogin"))
        } else {
          navigate(from);
          toast.error(t("errors.authenticationFailed"))
        }
      } else {
        navigate(from);
        toast.error(t("errors.authenticationFailed"))
      }
    };

    verifyToken().then(() => null);
  }, [access_token, dispatch, location, navigate, from, t]);

  return <Loader/>; // Show a loading indicator while processing
};

export default GoogleAuthCallback;
