import React from "react";
import {Input} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {UseFormRegister} from "react-hook-form";
import {TLoginSchema, TSignUpSchema} from "@/schemas/auth.ts";

interface EmailInputFieldProps {
  register: UseFormRegister<TSignUpSchema | TLoginSchema>;
  errorMessage?: string;
  isSubmitting: boolean;
}

const EmailInputField: React.FC<EmailInputFieldProps> = ({register, errorMessage, isSubmitting}) => {
  const {t} = useTranslation();

  return (
    <Input
      {...register("email")}
      autoFocus
      isRequired
      label={t("forms.email")}
      variant="bordered"
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      isDisabled={isSubmitting}
    />
  );
};

export default EmailInputField;
