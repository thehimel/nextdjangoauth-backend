import { AxiosError } from "axios";

interface ErrorsV2Interface {
  message?: string;
  [key: string]: string[] | string | boolean | undefined;
}

export const getErrorsV2 = ({ error }: { error: AxiosError }): ErrorsV2Interface => {
  const { message, response } = error;
  const errors: ErrorsV2Interface = { message };

  if (response?.data && typeof response.data === "object") {
    return {
      ...response.data,
      message,
    };
  }

  return errors;
};
