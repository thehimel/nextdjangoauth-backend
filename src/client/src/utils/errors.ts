import { AxiosError } from "axios";

interface ErrorsInterface {
  message?: string;
  [key: string]: string[] | string | boolean | undefined;
}

export const getErrors = (error: AxiosError): ErrorsInterface => {
  const { message, response } = error;

  // Check if response.data is an object and merge it with the message
  const responseErrors = response?.data && typeof response.data === "object"
    ? response.data
    : {};

  return {
    ...responseErrors,
    message,
  };
};
