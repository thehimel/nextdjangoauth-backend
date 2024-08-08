import {logout} from "@/store/auth/actions/logout.ts";
import {AppDispatch} from "@/store/store.ts";
import i18n from "i18next";
import {toast} from "sonner";

export const handleLogout = async (dispatch: AppDispatch) => {
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
