import React from "react";

export const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length !== 0 && emailPattern.test(email)
}

export const isValidUsername = (username: string) => {
  const usernamePattern = /^[a-zA-Z0-9]{6,}$/;
  return usernamePattern.test(username);
};

export const isValidPassword = (password: string) => {
  return password.length > 0;
}

export interface ValidateFieldProps {
  isValid: boolean;
  setIsFieldValid: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
}

export const validateField = ({isValid, setIsFieldValid, setFieldErrorMessage, errorMessage}: ValidateFieldProps): boolean => {
  setIsFieldValid(isValid);
  setFieldErrorMessage(isValid ? "" : errorMessage);
  return isValid;
};
