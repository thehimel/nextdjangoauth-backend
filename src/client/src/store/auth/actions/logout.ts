import {LOGOUT_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/browser/cookies.ts";
import {getErrors} from "@/utils/api/errors.ts";
import axios, {AxiosError} from "axios";

export interface LogoutResponseInterface {
  success: boolean;
  errors?: {
    message?: string;
  };
}

export const LogoutResponse: LogoutResponseInterface = {
  success: false,
}

export const logout = () => {
  return async (dispatch: AppDispatch): Promise<LogoutResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response = LogoutResponse;

    try {
      dispatch(authActions.setAuthLoading(true));

      await axios.post(LOGOUT_API_URL,{headers: headers});
      dispatch(authActions.logout());
      response.success = true;
    } catch (error) {
      const errors = getErrors(error as AxiosError);
      response.success = false;
      response.errors = { message: errors.message };
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
