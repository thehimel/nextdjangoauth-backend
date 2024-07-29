import {authActions} from "@/store/auth/authSlice.ts";
import {USER_API_URL} from "@/constants/urls.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface UpdateProfileInterface {
  access: string,
  username?: string,
  firstName: string,
  lastName: string,
}

export interface UpdateProfileResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      username: string;
      firstName: string;
      lastName: string;
    };
    message: string;
  };
  isTokenValid: boolean;
}

export const InitialUpdateProfileResponse: UpdateProfileResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      username: "",
      firstName: "",
      lastName: "",
    },
    message: "",
  },
  isTokenValid: false,
}

export const updateProfile = ({access, username, firstName, lastName}: UpdateProfileInterface) => {
  return async (dispatch: AppDispatch): Promise<UpdateProfileResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    }

    const response = InitialUpdateProfileResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
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
      const errors = getErrors({error: error as AxiosError});
      response.success = false;
      response.isTokenValid = errors.isTokenValid;

      response.errors.data.username = errors.data?.username?.[0] ?? "";
      response.errors.data.firstName = errors.data?.first_name?.[0] ?? "";
      response.errors.data.lastName = errors.data?.last_name?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
