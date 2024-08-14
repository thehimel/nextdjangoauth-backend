import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { UseFormRegister } from "react-hook-form";
import {TLoginSchema, TSignUpSchema} from "@/schemas/auth.ts";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/eyes.tsx";

interface PasswordInputFieldProps {
  register: UseFormRegister<TSignUpSchema | TLoginSchema>;
  errorMessage?: string;
  isSubmitting: boolean;
  type: "password" | "confirmPassword";
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({ register, errorMessage, isSubmitting, type }) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <Input
      {...register(type)}
      isRequired
      label={t(`forms.${type}`)}
      variant="bordered"
      type={isPasswordVisible ? "text" : "password"}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
      isDisabled={isSubmitting}
      endContent={
        <button type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
        </button>
      }
    />
  );
};

export default PasswordInputField;
