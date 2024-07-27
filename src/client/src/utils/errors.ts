import {AxiosError} from "axios";

export interface ErrorInterface {
  apiUrl: string;
  errors: string[];
}

export const getErrorMessage = ({apiUrl, error} : {apiUrl: string, error: AxiosError}) => {
  const errorMessage: ErrorInterface = {
    apiUrl: apiUrl,
    errors: [],
  }
  if (error.response) {
    errorMessage.errors = [error.response.data as never]
  } else {
    errorMessage.errors = [error.message || 'An unknown error occurred'];
  }
  return errorMessage
};
