import {logout} from "@/store/auth/actions/logout.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {AUTH_TOKEN} from "@/utils/auth.ts";
import i18n from "i18next";
import secureSessionStorage from "react-secure-storage";
import {toast} from "sonner";

export const useClearSessionToken = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const rememberMe = useAppSelector((state) => state.auth.rememberMe);

  return async () => {
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
};

export const useLogout = () => {
  const dispatch: AppDispatch = useAppDispatch();
  return async () => {
    try {
      const response = await dispatch(logout());
      if (response.success) {
        toast.success(i18n.t("auth.logout.success"));
      } else {
        toast.error(response.errors?.message || i18n.t("auth.logout.error"));
      }
    } catch (error) {
      toast.error(i18n.t("errors.unexpectedError"));
    }
  };
};
