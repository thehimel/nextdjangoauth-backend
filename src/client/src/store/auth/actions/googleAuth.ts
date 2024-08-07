import {GOOGLE_AUTH_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface GoogleAuthInterface {
  access_token: string;
}

export interface GoogleAuthResponseInterface {
  success: boolean;
  errors: {
    data: {
      code: string;
      email: string;
    };
  };
}

export const InitialGoogleAuthResponse: GoogleAuthResponseInterface = {
  success: false,
  errors: {
    data: {
      code: "",
      email: "",
    }
  }
}

export const googleAuth = ({access_token}: GoogleAuthInterface) => {
  return async (dispatch: AppDispatch): Promise<GoogleAuthResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response: GoogleAuthResponseInterface = InitialGoogleAuthResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        access_token: access_token,
      };

      const result = await axios.post(GOOGLE_AUTH_API_URL, params,{headers: headers});
      dispatch(authActions.setUserData(result.data));
      dispatch(authActions.setRememberMe(true));

      response.success = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});
      console.log(error);
      response.success = false;
      response.errors.data.code = errors.data?.code ?? "";
      response.errors.data.email = errors.data?.email?.[0] ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    console.log(response);
    return response;
  };
};
