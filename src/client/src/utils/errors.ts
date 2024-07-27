import {AxiosError} from "axios";

interface ErrorsInterface {
  data: Record<string, string[]> | undefined;
  message: string | undefined;
}

export const getErrors = ({error} : {error: AxiosError}) => {
  const errors: ErrorsInterface = {
    data: undefined,
    message: undefined,
  };

  if (error.response) {
    if (error.response.data === "") {
      errors.message = error.message || "An unknown error occurred";
    } else {
      errors.data = error.response.data as never;
    }
  }
  return errors
};
