import {TOKEN_NOT_VALID} from "@/apps/auth/constants/errorCodes.ts";
import {PASSWORD_CHANGE_API_URL, PASSWORD_RESET_CONFIRM_API_URL} from "@/apps/auth/urls/server.ts";
import {authActions} from "@/apps/auth/store/authSlice.ts";
import {AppDispatch} from "@/core/store/store.ts";
import {getCookie} from "@/apps/auth/utils/browser/cookies.ts";
import {getErrors} from "@/apps/auth/utils/api/errors.ts";
import axios, {AxiosError} from "axios";
import i18n from "i18next";

export interface PasswordUpdateInterface {
  access?: string,
  password: string;
  confirmPassword: string;
  uid?: string;
  token?: string;
  type: "change" | "reset";
}

export interface PasswordUpdateResponseInterface {
  success: boolean;
  isTokenValid: boolean;
  errors?: {
    code?: string;
    message?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export const InitialPasswordUpdateResponse: PasswordUpdateResponseInterface = {
  success: false,
  isTokenValid: true,
}

export const passwordUpdate = (data: PasswordUpdateInterface) => {
  const {access, password, confirmPassword, uid, token, type} = data
  return async (dispatch: AppDispatch): Promise<PasswordUpdateResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      ...(type === "change" && { 'Authorization': `Bearer ${access}` }),
    }

    const response: PasswordUpdateResponseInterface = { ...InitialPasswordUpdateResponse };

    try {
      dispatch(authActions.setAuthLoading(true));

      const params: Record<string, string> = {
        new_password1: password,
        new_password2: confirmPassword,
        ...(type === "reset" && { uid: uid, token: token }),
      };
      const apiUrl = type === "reset" ? PASSWORD_RESET_CONFIRM_API_URL : PASSWORD_CHANGE_API_URL;
      await axios.post(apiUrl, params,{headers: headers});

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors(error as AxiosError);
      response.success = false;

      response.errors = {
        code: errors.code as string,
        message: errors.message,
        password: Array.isArray(errors.new_password1) ? errors.new_password1[0] : undefined,
        confirmPassword: Array.isArray(errors.new_password2) ? errors.new_password2[0] : undefined,
      };

      if (errors.uid || errors.token || response.errors.code === TOKEN_NOT_VALID) {
        response.isTokenValid = false;
      }

      if (response.errors.confirmPassword?.toLowerCase().includes("too common")) {
        response.errors.password = " ";  // Mark the password field as invalid
        response.errors.confirmPassword = i18n.t("auth.general.errors.passwordTooCommon");
      }
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
