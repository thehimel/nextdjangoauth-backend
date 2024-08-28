import {SendAuthEmailRequestType} from "@/components/auth/email/SendAuthEmail.tsx";
import {PASSWORD_RESET_API_URL, RESEND_EMAIL_VERIFICATION_API_URL} from "@/constants/urls.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/browser/cookies.ts";
import {getErrors} from "@/utils/api/errors.ts";
import axios, {AxiosError} from "axios";
import i18n from "i18next";

export interface SendAuthEmailInterface {
  email: string;
  type: SendAuthEmailRequestType;
}

export interface SendAuthEmailResponseInterface {
  success: boolean;
  errors?: {
    email?: string;
  };
}

export const InitialSendAuthEmailResponse: SendAuthEmailResponseInterface = {
  success: false,
}

export const sendAuthEmail = (data: SendAuthEmailInterface) => {
  const {email, type} = data;

  return async (dispatch: AppDispatch): Promise<SendAuthEmailResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response: SendAuthEmailResponseInterface = { ...InitialSendAuthEmailResponse };

    try {
      dispatch(authActions.setAuthLoading(true));
      const params = {email: email};
      const apiUrl = type === "resend_email_verification" ? RESEND_EMAIL_VERIFICATION_API_URL
        : type === "forgot_password" ? PASSWORD_RESET_API_URL : "";

      await axios.post(apiUrl, params,{headers: headers});
      response.success = true;
    } catch (error) {
      const errors = getErrors(error as AxiosError);
      response.success = false;

      response.errors = {
        email: Array.isArray(errors.email) ? errors.email[0] : undefined,
      };

      if (response.errors.email?.toLowerCase().includes("not found")) {
        response.errors.email = i18n.t("errors.emailNotFound");
      }
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
