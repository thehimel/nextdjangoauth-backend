import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TSignUpSchema } from "@/constants/interfaces.ts";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/eyes.tsx";

interface PasswordInputProps {
  register: UseFormRegister<TSignUpSchema>;
  errors: FieldErrors<TSignUpSchema>;
  isSubmitting: boolean;
  type: "password" | "confirmPassword";
}

const PasswordInput: React.FC<PasswordInputProps> = ({ register, errors, isSubmitting, type }) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <Input
      {...register(type)}
      isRequired
      endContent={
        <button type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
        </button>
      }
      label={t(`forms.${type}`)}
      name={type}
      autoComplete="new-password"
      variant="bordered"
      type={isPasswordVisible ? "text" : "password"}
      errorMessage={errors[type]?.message}
      isInvalid={!!errors[type]}
      isDisabled={isSubmitting}
    />
  );
};

export default PasswordInput;
