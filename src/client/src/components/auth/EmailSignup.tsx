import EmailInput from "@/components/auth/EmailInput.tsx";
import PasswordInput from "@/components/auth/PasswordInput.tsx";
import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {signUpSchema, TSignUpSchema} from "@/constants/interfaces.ts";
import {authV2, AuthV2ResponseInterface, signup} from "@/store/auth/actions/authV2.ts";
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

const EmailSignup: React.FC<EmailSignupProps> = ({onSignupSuccessChange}) => {
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
        <EmailInput register={register} errors={errors} isSubmitting={isSubmitting}/>
        <PasswordInput register={register} errors={errors} isSubmitting={isSubmitting} type="password"/>
        <PasswordInput register={register} errors={errors} isSubmitting={isSubmitting} type="confirmPassword"/>
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

export default EmailSignup;
