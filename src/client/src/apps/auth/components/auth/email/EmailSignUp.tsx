import EmailInputField, {TEmailInputFieldRegister} from "@/apps/auth/components/auth/email/fields/EmailInputField.tsx";
import PasswordInputField, {TPasswordInputFieldRegister} from "@/apps/auth/components/auth/email/fields/PasswordInputField.tsx";
import SubmitButton from "@/apps/auth/components/auth/SubmitButton.tsx";
import {EMAIL_REGISTERED_WITH_SOCIAL_LOGIN} from "@/apps/auth/constants/errorCodes.ts";
import {signUpSchema, TSignUpSchema} from "@/apps/auth/schemas/auth.ts";
import {auth, AuthResponseInterface, signup} from "@/store/auth/actions/auth.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Icon} from "@iconify/react";
import {Button} from "@nextui-org/react";
import React from "react";
import {useForm} from "react-hook-form";
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
    const response: AuthResponseInterface = await dispatch(auth(authData));
    if (response.success) {
      onSignupSuccessChange(true);
      return;
    }

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
  };

  return (
    isEmailSignup ? (
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <EmailInputField
          register={register as TEmailInputFieldRegister}
          errorMessage={errors["email"]?.message}
          isSubmitting={isSubmitting}
        />
        <PasswordInputField
          register={register as TPasswordInputFieldRegister}
          errorMessage={errors["password"]?.message}
          isSubmitting={isSubmitting}
          type="password"
        />
        <PasswordInputField
          register={register as TPasswordInputFieldRegister}
          errorMessage={errors["confirmPassword"]?.message}
          isSubmitting={isSubmitting}
          type="confirmPassword"
        />
        <SubmitButton isDisabled={isSubmitting} isLoading={isSubmitting} title={t("navigation.signup")}/>
      </form>
    ) : (
      <Button
        className="w-full"
        color="default"
        startContent={<Icon icon="ic:baseline-email" width={24}/>}
        onClick={() => setIsEmailSignup(true)}
      >
        {t("auth.signup.withEmail")}
      </Button>
    )
  );
}

export default EmailSignUp;
