import {TProfileUpdateSchema} from "@/apps/auth/schemas/users.ts";
import React from "react";
import {Input} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {UseFormRegister} from "react-hook-form";

interface TextInputFieldProps {
  register: UseFormRegister<TProfileUpdateSchema>;
  errorMessage?: string;
  isSubmitting: boolean;
  type: "username" | "firstName" | "lastName";
  autoComplete?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({register, errorMessage, isSubmitting, type, autoComplete}) => {
  const {t} = useTranslation();

  return (
    <Input
      {...register(type)}
      isRequired
      variant="bordered"
      labelPlacement="outside"
      label={t(`forms.${type}`)}
      placeholder={t(`placeholders.${type}`)}
      autoComplete={autoComplete}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      isDisabled={isSubmitting}
    />
  );
};

export default TextInputField;
