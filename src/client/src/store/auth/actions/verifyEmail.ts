import {VERIFY_EMAIL_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrorsV2} from "@/utils/errorsV2.ts";
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
      getErrorsV2(error as AxiosError);
      response = false;
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
}
