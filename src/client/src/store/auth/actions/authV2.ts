import {TOKEN_NOT_VALID} from "@/constants/errorCodes.ts";
import {LOGIN_API_URL, SIGNUP_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrorsV2} from "@/utils/errorsV2.ts";
import axios, {AxiosError} from "axios";

export const signup = "signup";
export const login = "login";

export interface AuthV2Interface {
  email: string;
  password: string;
  confirmPassword?: string;
  isRememberMe?: boolean;
  type: typeof signup | typeof login;
}

export interface AuthV2ResponseInterface {
  success: boolean;
  provider: string;
  errors?: {
    code?: string;
    message?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  isTokenValid: boolean;
}

export const InitialAuthV2Response: AuthV2ResponseInterface = {
  success: false,
  provider: "email",
  isTokenValid: false,
};

export const authV2 = (authData: AuthV2Interface) => {
  return async (dispatch: AppDispatch): Promise<AuthV2ResponseInterface> => {
    const { email, password, confirmPassword, isRememberMe, type } = authData;
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    };

    const response: AuthV2ResponseInterface = { ...InitialAuthV2Response };

    try {
      dispatch(authActions.setAuthLoading(true));

      const params = {
        email,
        ...(type === login ? { password } : { password1: password, password2: confirmPassword }),
      };

      const apiUrl = type === signup ? SIGNUP_API_URL : LOGIN_API_URL;
      const result = await axios.post(apiUrl, params, { headers });

      if (type === login) {
        dispatch(authActions.setUserData(result.data));
        dispatch(authActions.setRememberMe(isRememberMe));
      }

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrorsV2(error as AxiosError);
      response.success = false;

      response.errors = {
        code: errors.code as string,
        message: errors.message,
        email: Array.isArray(errors.email) ? errors.email[0] : undefined,
        password: Array.isArray(errors.password1) ? errors.password1[0] : undefined,
        confirmPassword: Array.isArray(errors.password2) ? errors.password2[0] : undefined,
      };

      if (response.errors.code === TOKEN_NOT_VALID) {
        response.isTokenValid = false;
      }

      response.provider = errors.provider as string ?? response.provider;
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }

    return response;
  };
};
