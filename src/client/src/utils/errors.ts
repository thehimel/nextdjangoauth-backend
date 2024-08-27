import { AxiosError } from "axios";

interface ErrorsInterface {
  message?: string;
  [key: string]: string[] | string | boolean | undefined;
}

export const getErrors = (error: AxiosError): ErrorsInterface => {
  const { message, response } = error;
  const errors: ErrorsInterface = { message };

  if (response?.data && typeof response.data === "object") {
    return {
      ...response.data,
      message,
    };
  }

  return errors;
};
