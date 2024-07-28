import React from "react";

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
