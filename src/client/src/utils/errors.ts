import {AxiosError} from "axios";

interface ErrorsInterface {
  isTokenValid: boolean;
  data: {
    code?: string;
    provider?: string;
    [key: string]: string[] | string | undefined; // allows other keys with string[] values
  } | undefined;
  message: string | undefined;
}

export const getErrors = ({error} : {error: AxiosError}) => {
  const errors: ErrorsInterface = {
    isTokenValid: true,
    data: undefined,
    message: undefined,
  };

  if (error.response) {
    if (error.response.data === "") {
      errors.message = error.message || "An unknown error occurred";
    } else {
      errors.isTokenValid =
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'code' in error.response.data &&
        error.response.data.code === "token_not_valid"
          ? false
          : errors.isTokenValid;

      errors.data = error.response.data as never;
    }
  }
  return errors
};
