import React from "react";
import {Input} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {UseFormRegister} from "react-hook-form";
import {TLoginSchema, TSendAuthEmailSchema, TSignUpSchema} from "@/apps/auth/schemas/auth.ts";

export type TEmailInputFieldRegister = UseFormRegister<TSignUpSchema | TLoginSchema | TSendAuthEmailSchema>;

interface EmailInputFieldProps {
  register: TEmailInputFieldRegister
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
      label={t("auth.forms.email")}
      variant="bordered"
      autoComplete={"email"}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      isDisabled={isSubmitting}
    />
  );
};

export default EmailInputField;
