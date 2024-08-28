import {GOOGLE_AUTH_API_URL} from "@/constants/urls.ts";
import {GOOGLE} from "@/store/auth/actions/auth.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/apps/auth/utils/browser/cookies.ts";
import {getErrors} from "@/apps/auth/utils/api/errors.ts";
import axios, {AxiosError} from "axios";

export interface GoogleAuthInterface {
  access_token: string;
}

export interface GoogleAuthResponseInterface {
  success: boolean;
  errors?: {
    code?: string;
    email?: string;
  };
}

export const InitialGoogleAuthResponse: GoogleAuthResponseInterface = {
  success: false,
}

export const googleAuth = ({access_token}: GoogleAuthInterface) => {
  return async (dispatch: AppDispatch): Promise<GoogleAuthResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response: GoogleAuthResponseInterface = { ...InitialGoogleAuthResponse };

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        access_token: access_token,
      };

      const result = await axios.post(GOOGLE_AUTH_API_URL, params, {headers: headers});
      dispatch(authActions.setUserData({
        ...result.data,
        provider: GOOGLE,
        rememberMe: true,
      }));
      response.success = true;
    } catch (error) {
      const errors = getErrors(error as AxiosError);
      response.success = false;

      response.errors = {
        code: errors.code as string,
        email: Array.isArray(errors.email) ? errors.email[0] : undefined,
      };
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
