import {SIGNUP_API_URL} from "@/store/constants.ts";
import {getCookie} from "@/utils/cookies.ts";
import axios from "axios";

interface Signup {
  email: string,
  password: string,
  confirmPassword: string
}

export const signup = ({email, password, confirmPassword}: Signup) => {
  return async () => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    try {
      const params: Record<string, string> = {
        email: email,
        password1: password,
        password2: confirmPassword
      };
      await axios.post(SIGNUP_API_URL, params,{headers: headers});
    } catch (error) {
      console.log(error);
    }
  };
};
