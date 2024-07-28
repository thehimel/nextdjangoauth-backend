import {authActions} from "@/store/auth/authSlice.ts";
import {LOGIN_API_URL, SIGNUP_API_URL, VERIFY_EMAIL_URL} from "@/store/constants.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

interface Signup {
  email: string,
  password: string,
  confirmPassword?: string,
  isRememberMe: boolean,
}

export interface SignupResponse {
  success: boolean;
  message: string;
  errors: {
    data: {
      email: string;
      password: string;
    };
    message: string;
  };
}

export const InitialSignupResponse: SignupResponse = {
  success: false,
  message: "",
  errors: {
    data: {
      email: "",
      password: "",
    },
    message: "",
  },
}

export const signup = ({email, password, confirmPassword, isRememberMe}: Signup) => {
  return async (dispatch: AppDispatch): Promise<SignupResponse> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response = InitialSignupResponse;
    console.log(isRememberMe);

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        email: email,
        ...(!confirmPassword && { password: password }),
        ...(confirmPassword && { password1: password, password2: confirmPassword }),
      };
      await axios.post(confirmPassword ? SIGNUP_API_URL : LOGIN_API_URL, params,{headers: headers});
      response.success = true;
    } catch (error) {
      console.log(error);
      const errors = getErrors({error: error as AxiosError});
      response.errors.data.email = errors.data?.email?.[0] ?? "";
      response.errors.data.password = errors.data?.password1?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};

export const verifyEmail = ({key}: {key: string}) => {
  return async (dispatch: AppDispatch) => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    let response = false;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        key: key,
      };
      await axios.post(VERIFY_EMAIL_URL, params,{headers: headers});
      response = true;
    } catch (error) {
      getErrors({error: error as AxiosError});
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
}
