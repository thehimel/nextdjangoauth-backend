import React from "react";
import { Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TSignUpSchema } from "@/constants/interfaces.ts";

interface EmailInputProps {
  register: UseFormRegister<TSignUpSchema>;
  errors: FieldErrors<TSignUpSchema>;
  isSubmitting: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ register, errors, isSubmitting }) => {
  const { t } = useTranslation();

  return (
    <Input
      {...register("email")}
      autoFocus
      isRequired
      label={t("forms.email")}
      name="email"
      autoComplete="email"
      type="email"
      variant="bordered"
      errorMessage={errors.email?.message}
      isInvalid={!!errors.email}
      isDisabled={isSubmitting}
    />
  );
};

export default EmailInput;
