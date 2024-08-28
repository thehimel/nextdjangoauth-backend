import {TOKEN_NOT_VALID} from "@/constants/errorCodes.ts";
import {authActions} from "@/store/auth/authSlice.ts";
import {USER_API_URL} from "@/constants/urls.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/browser/cookies.ts";
import {getErrors} from "@/utils/api/errors.ts";
import axios, {AxiosError} from "axios";
import i18n from "i18next";

export interface ProfileUpdateInterface {
  access: string,
  username?: string,
  firstName: string,
  lastName: string,
}

export interface ProfileUpdateResponseInterface {
  success: boolean;
  isTokenValid: boolean;
  errors?: {
    code?: string;
    message?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const InitialProfileUpdateResponse: ProfileUpdateResponseInterface = {
  success: false,
  isTokenValid: true,
}

export const profileUpdate = (userData: ProfileUpdateInterface) => {
  return async (dispatch: AppDispatch): Promise<ProfileUpdateResponseInterface> => {
    const {access, username, firstName, lastName} = userData;
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    }

    const response: ProfileUpdateResponseInterface = { ...InitialProfileUpdateResponse };

    try {
      dispatch(authActions.setAuthLoading(true));

      const params = {
        first_name: firstName,
        last_name: lastName,
        ...(username && { username })
      };

      await axios.patch(USER_API_URL, params,{headers: headers});
      const result = await axios.get(USER_API_URL, {headers: headers});

      dispatch(authActions.setUserDetails(result.data));

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors(error as AxiosError);
      response.success = false;

      response.errors = {
        code: errors.code as string,
        message: errors.message,
        username: Array.isArray(errors.username) ? errors.username[0] : undefined,
        firstName: Array.isArray(errors.firstName) ? errors.firstName[0] : undefined,
        lastName: Array.isArray(errors.lastName) ? errors.lastName[0] : undefined,
      };

      if (response.errors.username && response.errors.username.toLowerCase().includes("already exists")) {
        response.errors.username = i18n.t("errors.usernameAlreadyExists");
      }

      if (response.errors.code === TOKEN_NOT_VALID) {
        response.isTokenValid = false;
      }
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
