import {logout} from "@/store/auth/actions/logout.ts";
import {AppDispatch} from "@/store/store.ts";
import i18n from "i18next";
import secureLocalStorage from 'react-secure-storage';
import secureSessionStorage from 'react-secure-storage';
import {toast} from "sonner";

interface AuthProps {
  token: string;
  rememberMe: boolean;
}

const AUTH_TOKEN = 'authToken';

export const setAuthToken = ({ token, rememberMe }: AuthProps) => {
  if (rememberMe) {
    secureLocalStorage.setItem(AUTH_TOKEN, token);
  } else {
    secureSessionStorage.setItem(AUTH_TOKEN, token);
  }
};

export const getAuthToken = (): string | null => {
  return (secureLocalStorage.getItem(AUTH_TOKEN) || secureSessionStorage.getItem(AUTH_TOKEN)) as string | null;
};

export const clearAuthToken = () => {
  secureLocalStorage.removeItem(AUTH_TOKEN);
  secureSessionStorage.removeItem(AUTH_TOKEN);
};

export const clearSessionTokenOnLoad = async (dispatch: AppDispatch, rememberMe: boolean) => {
  const token = secureSessionStorage.getItem(AUTH_TOKEN);
  if (!rememberMe && token) {
    try {
      const response = await dispatch(logout());
      if (!response.success) {
        toast.error(response.errors?.message || i18n.t("errors.authToken"));
      }
    } catch (error) {
      toast.error(i18n.t("errors.unexpectedError"));
    }
  }
};
