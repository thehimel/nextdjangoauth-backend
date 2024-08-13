import EmailInputField from "@/components/auth/EmailInputField.tsx";
import PasswordInput from "@/components/auth/PasswordInput.tsx";
import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {EMAIL_REGISTERED_WITH_SOCIAL_LOGIN} from "@/constants/errorCodes.ts";
import {signUpSchema, TLoginSchema, TSignUpSchema} from "@/constants/interfaces.ts";
import {authV2, AuthV2ResponseInterface, signup} from "@/store/auth/actions/authV2.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Icon} from "@iconify/react";
import {Button} from "@nextui-org/react";
import React from "react";
import {useForm, UseFormRegister} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

interface EmailSignupProps {
  onSignupSuccessChange: (value: boolean) => void;
}

const EmailSignUp: React.FC<EmailSignupProps> = ({onSignupSuccessChange}) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();

  const [isEmailSignup, setIsEmailSignup] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // reset,
    setError,
    // clearErrors,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema(t)),
  });

  const onSubmit = async (data: TSignUpSchema) => {
    const authData = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      type: "signup" as typeof signup,
    }
    const response: AuthV2ResponseInterface = await dispatch(authV2(authData));
    if (response.success) {
      onSignupSuccessChange(true);
    } else {
      const errors = response.errors;
      if (!errors) {
        toast.error(t("errors.unexpectedError"));
        return;
      }

      const emailRegisteredWithSocialLogin = errors.code === EMAIL_REGISTERED_WITH_SOCIAL_LOGIN;
      if (emailRegisteredWithSocialLogin) {
        const provider = response.provider
        setError("email", {
          type: "server",
          message: t("errors.emailRegisteredWithSocialLogin", { provider }),
        })
        return;
      }

      (Object.keys(errors) as Array<keyof TSignUpSchema>).forEach((key) => {
        if (errors[key]) {
          setError(key, {
            type: "server",
            message: errors[key] || t("errors.unexpectedError"),
          });
        }
      });
    }
  };

  return (
    isEmailSignup ? (
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <EmailInputField
          register={register as UseFormRegister<TSignUpSchema | TLoginSchema>}
          errorMessage={errors["email"]?.message}
          isSubmitting={isSubmitting}
          id={"signupEmail"}
        />
        <PasswordInput
          register={register as UseFormRegister<TSignUpSchema | TLoginSchema>}
          errorMessage={errors["password"]?.message}
          isSubmitting={isSubmitting}
          type="password"
          id={"signupPassword"}
        />
        <PasswordInput
          register={register as UseFormRegister<TSignUpSchema | TLoginSchema>}
          errorMessage={errors["confirmPassword"]?.message}
          isSubmitting={isSubmitting}
          type="confirmPassword"
          id={"signupConfirmPassword"}
        />
        <SubmitButton isDisabled={isSubmitting} isLoading={isSubmitting} title={t("navigation.signup")}/>
      </form>
    ) : (
      <Button
        className="w-full"
        color="primary"
        startContent={<Icon icon="ic:baseline-email" width={24}/>}
        onClick={() => setIsEmailSignup(true)}
      >
        {t("auth.signup.withEmail")}
      </Button>
    )
  );
}

export default EmailSignUp;
