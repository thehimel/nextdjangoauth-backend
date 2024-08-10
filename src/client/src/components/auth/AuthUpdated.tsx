import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailInput from "@/components/auth/emailInput.tsx";
import PasswordInput from "@/components/auth/passwordInput.tsx";
import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {signUpSchema, TSignUpSchema} from "@/constants/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
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

  const header = <AuthHeader title={t("common.welcome")} message={{text: t("auth.signup.createAccount")}}/>

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {header}
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <EmailInput register={register} errors={errors} isSubmitting={isSubmitting} />
          <PasswordInput register={register} errors={errors} isSubmitting={isSubmitting} type="password" />
          <PasswordInput register={register} errors={errors} isSubmitting={isSubmitting} type="confirmPassword" />
          <SubmitButton isSubmitting={isSubmitting} title={t("navigation.signup")}/>
        </form>
      </div>
    </div>
  );
}

export default AuthUpdated;
