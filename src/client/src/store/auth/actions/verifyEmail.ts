import {VERIFY_EMAIL_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/apps/auth/utils/browser/cookies.ts";
import {getErrors} from "@/apps/auth/utils/api/errors.ts";
import axios, {AxiosError} from "axios";

interface VerifyEmailInterface {
  key: string;
}

export const verifyEmail = ({key}: VerifyEmailInterface) => {
  return async (dispatch: AppDispatch) => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    let response = false;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = { key: key };
      await axios.post(VERIFY_EMAIL_API_URL, params,{headers: headers});
      response = true;
    } catch (error) {
      getErrors(error as AxiosError);
      response = false;
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
}
