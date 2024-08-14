import {TOKEN_NOT_VALID} from "@/constants/errorCodes.ts";
import {CHANGE_PASSWORD_API_URL, RESET_PASSWORD_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrorsV2} from "@/utils/errorsV2.ts";
import axios, {AxiosError} from "axios";

export interface UpdatePasswordV2Interface {
  access?: string,
  password: string;
  confirmPassword: string;
  uid?: string;
  token?: string;
  type: "change" | "reset";
}

export interface UpdatePasswordV2ResponseInterface {
  success: boolean;
  isTokenValid: boolean;
  errors?: {
    code?: string;
    message?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export const UpdateChangePasswordV2Response: UpdatePasswordV2ResponseInterface = {
  success: false,
  isTokenValid: true,
}

export const updatePasswordV2 = (data: UpdatePasswordV2Interface) => {
  const {access, password, confirmPassword, uid, token, type} = data
  return async (dispatch: AppDispatch): Promise<UpdatePasswordV2ResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      ...(type === "change" && { 'Authorization': `Bearer ${access}` }),
    }

    const response: UpdatePasswordV2ResponseInterface = { ...UpdateChangePasswordV2Response };

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
      const errors = getErrorsV2(error as AxiosError);
      response.success = false;

      response.errors = {
        code: errors.code as string,
        message: errors.message,
        password: Array.isArray(errors.new_password1) ? errors.new_password1[0] : undefined,
        confirmPassword: Array.isArray(errors.new_password2) ? errors.new_password2[0] : undefined,
      };

      if (response.errors.code === TOKEN_NOT_VALID) {
        response.isTokenValid = false;
      }
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
