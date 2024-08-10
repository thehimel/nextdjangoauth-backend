import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailInput from "@/components/auth/emailInput.tsx";
import PasswordInput from "@/components/auth/passwordInput.tsx";
import {signUpSchema, TSignUpSchema} from "@/constants/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, Spinner} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

const AuthUpdated = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // reset,
    // setError,
    // clearErrors,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema(t)),
  });

  const onSubmit = (data: TSignUpSchema) => {
    console.log(data);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AuthHeader headerTitle={t("common.welcome")} headline={{text: t("auth.signup.createAccount"), color: "default"}}/>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <EmailInput register={register} errors={errors} isSubmitting={isSubmitting} />
          <PasswordInput register={register} errors={errors} isSubmitting={isSubmitting} type="password" />
          <PasswordInput register={register} errors={errors} isSubmitting={isSubmitting} type="confirmPassword" />
          <Button
            color="primary"
            type="submit"
            isDisabled={isSubmitting}
            endContent={isSubmitting ? (<Spinner size="sm" color="default"/>) : null}>
            {t("navigation.signup")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AuthUpdated;
