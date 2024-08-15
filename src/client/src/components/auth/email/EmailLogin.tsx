import EmailInputField, {TEmailInputFieldRegister} from "@/components/auth/email/fields/EmailInputField.tsx";
import PasswordInputField, {TPasswordInputFieldRegister} from "@/components/auth/email/fields/PasswordInputField.tsx";
import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {EMAIL_REGISTERED_WITH_SOCIAL_LOGIN} from "@/constants/errorCodes.ts";
import {loginSchema, TLoginSchema} from "@/schemas/auth.ts";
import {FORGOT_PASSWORD_URL, HOME_URL} from "@/constants/urls.ts";
import {auth, AuthResponseInterface, login} from "@/store/auth/actions/auth.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Icon} from "@iconify/react";
import {Button, Checkbox, Link} from "@nextui-org/react";
import React from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

interface EmailLoginProps {
  isEmailLoginSelected?: boolean;
}

const EmailLogin: React.FC<EmailLoginProps> = ({isEmailLoginSelected}) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();

  const location = useLocation();
  const from = location.state?.from || HOME_URL;
  const navigate = useNavigate();

  const [isEmailLogin, setIsEmailLogin] = React.useState(!!isEmailLoginSelected);
  const [isRememberMe, setIsRememberMe] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data: TLoginSchema) => {
    const authData = {
      email: data.email,
      password: data.password,
      type: "login" as typeof login,
    }

    const response: AuthResponseInterface = await dispatch(auth(authData));
    if (response.success) {
      navigate(from, { replace: true });
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

    setError("email", {
      type: "server",
      message: " ",
    });

    setError("password", {
      type: "server",
      message: t("errors.invalidEmailOrPassword"),
    });
  };

  return (
    isEmailLogin ? (
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
        <div className="flex items-center justify-between px-1 py-2">
          <Checkbox
            name="remember"
            size="sm"
            isInvalid={!isRememberMe}
            isDisabled={isSubmitting}
            defaultSelected={isRememberMe}
            onValueChange={(value) => setIsRememberMe(value)}
          >
            {t("auth.login.rememberMe")}
          </Checkbox>
          <Link className="text-default-500" href={FORGOT_PASSWORD_URL} size="sm">
            {t("auth.login.forgotPassword")}
          </Link>
        </div>
        <SubmitButton isDisabled={isSubmitting} isLoading={isSubmitting} title={t("navigation.login")}/>
      </form>
    ) : (
      <Button
        className="w-full"
        color="primary"
        startContent={<Icon icon="ic:baseline-email" width={24}/>}
        onClick={() => setIsEmailLogin(true)}
      >
        {t("auth.login.withEmail")}
      </Button>
    )
  );
}

export default EmailLogin;
