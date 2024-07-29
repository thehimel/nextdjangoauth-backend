import {AuthEmailRequestType} from "@/components/auth/SendAuthEmail.tsx";
import {FORGOT_PASSWORD_API_URL, RESEND_EMAIL_VERIFICATION_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface AuthEmailInterface {
  email: string;
  requestType: AuthEmailRequestType;
}

export interface AuthEmailResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      email: string;
    };
    message: string;
  };
}

export const InitialAuthEmailResponse: AuthEmailResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      email: "",
    },
    message: "",
  },
}

export const sendAuthEmail = ({email, requestType}: AuthEmailInterface) => {
  return async (dispatch: AppDispatch): Promise<AuthEmailResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response = InitialAuthEmailResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params = {email: email};
      const apiUrl = requestType === "resend_email_verification" ? RESEND_EMAIL_VERIFICATION_API_URL
        : requestType === "forgot_password" ? FORGOT_PASSWORD_API_URL : "";

      await axios.post(apiUrl, params,{headers: headers});
      response.success = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});
      response.errors.data.email = errors.data?.email?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
