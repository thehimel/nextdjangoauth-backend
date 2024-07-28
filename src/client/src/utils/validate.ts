import React from "react";

export const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length !== 0 && emailPattern.test(email)
}

export const isValidUsername = (username: string) => {
  const usernamePattern = /^[a-zA-Z0-9]{6,}$/;
  return usernamePattern.test(username);
};

export interface ValidateFieldProps {
  isValid: boolean;
  setValidity: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
}

export const validateField = ({isValid, setValidity, setErrorMessage, errorMessage}: ValidateFieldProps): boolean => {
  setValidity(isValid);
  setErrorMessage(isValid ? "" : errorMessage);
  return isValid;
};
