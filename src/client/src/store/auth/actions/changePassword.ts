import {CHANGE_PASSWORD_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

interface ChangePasswordInterface {
  access: string,
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordResponseInterface {
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

export const InitialChangePasswordResponse: ChangePasswordResponseInterface = {
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

export const changePassword = ({access, password, confirmPassword}: ChangePasswordInterface) => {
  return async (dispatch: AppDispatch): Promise<ChangePasswordResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    }

    const response = InitialChangePasswordResponse;

    try {
      dispatch(authActions.setAuthLoading(true));

      const params: Record<string, string> = {new_password1: password, new_password2: confirmPassword,};
      await axios.post(CHANGE_PASSWORD_API_URL, params,{headers: headers});

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});

      response.isTokenValid = errors.isTokenValid;
      response.errors.data.password = errors.data?.new_password1?.[0] ?? "";
      response.errors.data.confirmPassword = errors.data?.new_password2?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
