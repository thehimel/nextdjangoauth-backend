import {GOOGLE_AUTH_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface GoogleAuthInterface {
  access_token: string;
}

export const googleAuth = ({access_token}: GoogleAuthInterface) => {
  return async (dispatch: AppDispatch) => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    let response: boolean = true;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        access_token: access_token,
      };

      const result = await axios.post(GOOGLE_AUTH_API_URL, params,{headers: headers});
      dispatch(authActions.setUserData(result.data));
      dispatch(authActions.setRememberMe(true));
    } catch (error) {
      getErrors({error: error as AxiosError});
      response = false;
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
