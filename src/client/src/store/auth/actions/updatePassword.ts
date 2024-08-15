import {TOKEN_NOT_VALID} from "@/constants/errorCodes.ts";
import {CHANGE_PASSWORD_API_URL, RESET_PASSWORD_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";
import i18n from "i18next";

export interface UpdatePasswordInterface {
  access?: string,
  password: string;
  confirmPassword: string;
  uid?: string;
  token?: string;
  type: "change" | "reset";
}

export interface UpdatePasswordResponseInterface {
  success: boolean;
  isTokenValid: boolean;
  errors?: {
    code?: string;
    message?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export const UpdateChangePasswordResponse: UpdatePasswordResponseInterface = {
  success: false,
  isTokenValid: true,
}

export const updatePassword = (data: UpdatePasswordInterface) => {
  const {access, password, confirmPassword, uid, token, type} = data
  return async (dispatch: AppDispatch): Promise<UpdatePasswordResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      ...(type === "change" && { 'Authorization': `Bearer ${access}` }),
    }

    const response: UpdatePasswordResponseInterface = { ...UpdateChangePasswordResponse };

    try {
      dispatch(authActions.setAuthLoading(true));

      const params: Record<string, string> = {
        new_password1: password,
        new_password2: confirmPassword,
        ...(type === "reset" && { uid: uid, token: token }),
      };
      const apiUrl = type === "reset" ? RESET_PASSWORD_API_URL : CHANGE_PASSWORD_API_URL;
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
        response.errors.confirmPassword = i18n.t("errors.passwordTooCommon");
      }
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
