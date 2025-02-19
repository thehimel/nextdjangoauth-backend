import {TOKEN_NOT_VALID} from "@/apps/auth/constants/errorCodes.ts";
import {authActions} from "@/apps/auth/store/authSlice.ts";
import {USER_API_URL} from "@/apps/auth/urls/server.ts";
import {AppDispatch} from "@/core/store/store.ts";
import {getCookie} from "@/apps/auth/utils/browser/cookies.ts";
import {getErrors} from "@/apps/auth/utils/api/errors.ts";
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
        response.errors.username = i18n.t("profile.errors.usernameAlreadyExists");
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
