import React from "react";
import {Input} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {UseFormRegister} from "react-hook-form";
import {TLoginSchema, TSignUpSchema} from "@/constants/interfaces.ts";

interface EmailInputProps {
  register: UseFormRegister<TSignUpSchema | TLoginSchema>;
  errorMessage?: string;
  isSubmitting: boolean;
  id: string;
}

const EmailInputField: React.FC<EmailInputProps> = ({register, errorMessage, isSubmitting, id}) => {
  const {t} = useTranslation();

  return (
    <Input
      {...register("email")}
      id={id}
      autoFocus
      isRequired
      label={t("forms.email")}
      name="email"
      autoComplete="email"
      type="email"
      variant="bordered"
      errorMessage={errorMessage}
      isInvalid={!!errorMessage}
      isDisabled={isSubmitting}
    />
  );
};

export default EmailInputField;
