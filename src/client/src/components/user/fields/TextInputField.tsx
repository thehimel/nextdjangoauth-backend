import React from "react";
import {Input} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {UseFormRegister} from "react-hook-form";
import {TUpdateProfileSchema} from "@/constants/interfaces.ts";

interface TextInputFieldProps {
  register: UseFormRegister<TUpdateProfileSchema>;
  errorMessage?: string;
  isSubmitting: boolean;
  type: "username" | "firstName" | "lastName";
}

const TextInputField: React.FC<TextInputFieldProps> = ({register, errorMessage, isSubmitting, type}) => {
  const {t} = useTranslation();

  return (
    <Input
      {...register(type)}
      isRequired
      variant="bordered"
      labelPlacement="outside"
      label={t(`forms.${type}`)}
      placeholder={t(`placeholders.${type}`)}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      isDisabled={isSubmitting}
    />
  );
};

export default TextInputField;
