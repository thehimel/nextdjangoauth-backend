import {authActions} from "@/store/auth/authSlice.ts";
import {SIGNUP_API_URL} from "@/store/constants.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

interface Signup {
  email: string,
  password: string,
  confirmPassword: string
}

export const signup = ({email, password, confirmPassword}: Signup) => {
  return async (dispatch: AppDispatch) => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        email: email,
        password1: password,
        password2: confirmPassword
      };
      const response = await axios.post(SIGNUP_API_URL, params,{headers: headers});
      console.log(response);
      dispatch(authActions.setSignupSuccess(true));
    } catch (error) {
      console.log(error);
      const errors = getErrors({error: error as AxiosError});
      if (errors.data) {
        dispatch(authActions.setSignupErrors(errors.data));
      }
      if (errors.message) {
        console.log(errors.message);
      }
      dispatch(authActions.setAuthLoading(false));
    }
  };
};
