import Loader from "@/components/screens/Loader.tsx";
import {HOME_URL} from "@/constants/urls.ts";
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

  const hash = location.hash;
  const access_token = new URLSearchParams(hash.replace('#', '?')).get('access_token');

  useEffect(() => {
    const verifyToken = async  () => {
      if (access_token) {
        const response = await dispatch(googleAuth({access_token}));
        if (response) {
          navigate(HOME_URL);
        } else {
          const from = location.state?.from?.pathname || HOME_URL;
          navigate(from);
          toast.error(t("errors.authenticationFailed"))
        }
      }
    };

    verifyToken().then(() => null);
  }, [access_token, dispatch, location.hash, navigate, t]);

  return <Loader/>; // Show a loading indicator while processing
};

export default GoogleAuthCallback;
