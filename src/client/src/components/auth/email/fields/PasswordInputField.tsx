import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { UseFormRegister } from "react-hook-form";
import {TLoginSchema, TSignUpSchema, TPasswordUpdateSchema} from "@/schemas/auth.ts";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/eyes.tsx";

export type TPasswordInputFieldRegister = UseFormRegister<TSignUpSchema | TLoginSchema | TPasswordUpdateSchema>;

interface PasswordInputFieldProps {
  register: TPasswordInputFieldRegister;
  errorMessage?: string;
  isSubmitting: boolean;
  type: "password" | "confirmPassword";
  label?: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({ register, errorMessage, isSubmitting, type, label }) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <Input
      {...register(type)}
      isRequired
      label={label || t(`forms.${type}`)}
      variant="bordered"
      type={isPasswordVisible ? "text" : "password"}
      autoComplete={"new-password"}
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
