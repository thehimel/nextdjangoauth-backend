import AuthHeader from "@/apps/auth/components/auth/email/AuthHeader.tsx";
import EmailInputField, {TEmailInputFieldRegister} from "@/apps/auth/components/auth/email/fields/EmailInputField.tsx";
import SubmitButton from "@/apps/auth/components/auth/SubmitButton.tsx";
import {MessageInterface} from "@/apps/base/types/common.ts";
import {sendAuthEmailSchema, TSendAuthEmailSchema} from "@/apps/auth/schemas/auth.ts";
import {
  SendAuthEmailResponseInterface,
  sendAuthEmail,
  SendAuthEmailInterface,
} from "@/apps/auth/store/actions/sendAuthEmail.ts";
import {useAppDispatch} from "@/core/store/hooks.ts";
import {AppDispatch} from "@/core/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {FC} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

export type SendAuthEmailRequestType = "resend_email_verification" | "forgot_password";

interface SendEmailProps {
  type: SendAuthEmailRequestType;
}

const SendAuthEmail: FC<SendEmailProps> = ({type}) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { t } = useTranslation();

  const isResendEmailVerificationPage = type === "resend_email_verification";
  const isForgotPasswordPage = type === "forgot_password";

  const headerTitle= isResendEmailVerificationPage ? t("auth.emailVerification.resendEmail")
    : isForgotPasswordPage ? t("auth.login.labels.forgotPassword") : t("base.general.welcome")

  const initialHeadline: MessageInterface = {
    text: isResendEmailVerificationPage ?
      t("auth.emailVerification.failed")
      : isForgotPasswordPage ? t("auth.passwordReset.enterEmail") : t("base.general.welcome"),
    color: isResendEmailVerificationPage ? "danger" : "default",
  }

  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [headline, setHeadline] = React.useState(initialHeadline);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TSendAuthEmailSchema>({
    resolver: zodResolver(sendAuthEmailSchema(t)),
  });

  const onSubmit = async (data: TSendAuthEmailSchema) => {
    const params: SendAuthEmailInterface = { email: data.email, type: type }

    const response: SendAuthEmailResponseInterface = await dispatch(sendAuthEmail(params))

    if (response.success) {
      setIsEmailSent(true);
      setHeadline({
        text: t(isResendEmailVerificationPage
          ? "auth.emailVerification.emailSent"
          : "auth.passwordReset.emailSent"),
        color: "default",
      });
      return;
    }

    const errors = response.errors;
    if (!errors) {
      toast.error(t("base.errors.unexpectedError"));
      return;
    }

    setError("email", {
      type: "server",
      message: errors["email"] || t("base.errors.unexpectedError"),
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AuthHeader title={headerTitle}/>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <p className={`text-${headline.color}`}>{headline.text}</p>
        {!isEmailSent &&
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <EmailInputField
              register={register as TEmailInputFieldRegister}
              errorMessage={errors["email"]?.message}
              isSubmitting={isSubmitting}
            />
            <SubmitButton isDisabled={isSubmitting} isLoading={isSubmitting} title={t("base.forms.labels.send")} color={"default"}/>
          </form>
        }
      </div>
    </div>
  );
}

export default SendAuthEmail;
