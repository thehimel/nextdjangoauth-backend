import {CHANGE_PASSWORD_API_URL, RESET_PASSWORD_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface UpdatePasswordInterface {
  access?: string,
  password: string;
  confirmPassword: string;
  uid?: string;
  token?: string;
  isChangePassword?: boolean;
  isResetPassword?: boolean;
}

export interface UpdatePasswordResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      password: string;
      confirmPassword: string;
    };
    message: string;
  };
  isTokenValid: boolean;
}

export const UpdateChangePasswordResponse: UpdatePasswordResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      password: "",
      confirmPassword: "",
    },
    message: "",
  },
  isTokenValid: false,
}

export const updatePassword = ({isChangePassword = false, isResetPassword = false, access, password, confirmPassword, uid, token}: UpdatePasswordInterface) => {
  return async (dispatch: AppDispatch): Promise<UpdatePasswordResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      ...(!isResetPassword && { 'Authorization': `Bearer ${access}` }),
    }

    const response = UpdateChangePasswordResponse;

    try {
      dispatch(authActions.setAuthLoading(true));

      const params: Record<string, string> = {
        new_password1: password,
        new_password2: confirmPassword,
        ...(isResetPassword && { uid: uid, token: token }),
      };
      const apiUrl = isResetPassword ? RESET_PASSWORD_API_URL : CHANGE_PASSWORD_API_URL;
      await axios.post(apiUrl, params,{headers: headers});

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});

      response.isTokenValid = isChangePassword ? errors.isTokenValid : response.isTokenValid;
      if (isResetPassword && errors.data?.token?.[0]) {
        response.isTokenValid = false;
      }

      response.errors.data.password = errors.data?.new_password1?.[0] ?? "";
      response.errors.data.confirmPassword = errors.data?.new_password2?.[0] ?? "";

      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
