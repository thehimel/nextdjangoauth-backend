import {LOGIN_API_URL, SIGNUP_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface AuthInterface {
  email: string;
  password: string;
  confirmPassword?: string;
  isRememberMe: boolean;
}

export interface AuthResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      email: string;
      password: string;
    };
    message: string;
  };
  isTokenValid: boolean;
}

export const InitialAuthResponse: AuthResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      email: "",
      password: "",
    },
    message: "",
  },
  isTokenValid: false,
}

export const auth = ({email, password, confirmPassword, isRememberMe}: AuthInterface) => {
  return async (dispatch: AppDispatch): Promise<AuthResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response: AuthResponseInterface = InitialAuthResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        email: email,
        ...(!confirmPassword && { password: password }),
        ...(confirmPassword && { password1: password, password2: confirmPassword }),
      };
      const apiUrl = confirmPassword ? SIGNUP_API_URL : LOGIN_API_URL;
      const result = await axios.post(apiUrl, params,{headers: headers});

      // Save the user data after login.
      if (!confirmPassword) {
        dispatch(authActions.setUserData(result.data));
        dispatch(authActions.setRememberMe(isRememberMe));
      }
      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});
      response.isTokenValid = errors.isTokenValid;
      response.errors.data.email = errors.data?.email?.[0] ?? "";
      response.errors.data.password = errors.data?.password1?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
