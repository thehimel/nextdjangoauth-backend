"use client";

import AuthHeader from "@/components/auth/email/AuthHeader.tsx";
import {MessageInterface} from "@/constants/interfaces.ts";
import {AuthEmailInterface, sendAuthEmail} from "@/store/auth/actions/sendAuthEmail.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidEmail, validateField} from "@/utils/validate.ts";
import {Button, Spinner} from "@nextui-org/react";

import {Input} from "@nextui-org/react";
import React, {FC, FormEvent} from "react";
import {useTranslation} from "react-i18next";

export type AuthEmailRequestType = "resend_email_verification" | "forgot_password";

interface SendEmailProps {
  type: AuthEmailRequestType;
}

const SendAuthEmail: FC<SendEmailProps> = ({type}) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { t } = useTranslation();

  const isResendEmailVerificationPage = type === "resend_email_verification";
  const isForgotPasswordPage = type === "forgot_password";

  const headerTitle= isResendEmailVerificationPage ? t("auth.emailVerification.resendEmail")
    : isForgotPasswordPage ? t("auth.login.forgotPassword") : t("common.welcome")

  const initialHeadline: MessageInterface = {
    text: isResendEmailVerificationPage ?
      t("auth.emailVerification.failed")
      : isForgotPasswordPage ? t("auth.passwordReset.enterEmail") : t("common.welcome"),
    color: isResendEmailVerificationPage ? "danger" : "default",
  }

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const [headline, setHeadline] = React.useState(initialHeadline);

  const [email, setEmail] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let isFormValid = true;

    isFormValid = validateField({
      isValid: isValidEmail(email),
      setIsFieldValid: setIsEmailValid,
      setFieldErrorMessage: setEmailErrorMessage,
      errorMessage: t("errors.invalidEmail"),
    }) && isFormValid;

    if (isFormValid) {
      setIsSubmitting(true);
      const params: AuthEmailInterface = {
        email: email,
        type: type
      }
      const response = await dispatch(sendAuthEmail(params));

      if (response.success) {
        setIsEmailSent(true);
        if (isResendEmailVerificationPage) {
          setHeadline({ text: t("auth.emailVerification.emailSent"), color: "default" });
        } else {
          setHeadline({ text: t("auth.passwordReset.emailSent"), color: "default" });
        }
      } else {
        const emailError = response.errors.data.email;
        if (emailError !== "") {
          setIsEmailValid(false);
          setEmailErrorMessage(response.errors.data.email);
        }
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AuthHeader title={headerTitle}/>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <p className={`text-${headline.color}`}>{headline.text}</p>
        {!isEmailSent &&
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input
              autoFocus
              isRequired
              label={t("forms.email")}
              name="email"
              autoComplete="email"
              type="email"
              variant="bordered"
              errorMessage={!isEmailValid ? emailErrorMessage : undefined}
              isInvalid={!isEmailValid}
              isDisabled={isSubmitting}
              value={email}
              onValueChange={(value) => {
                setIsEmailValid(true);
                setEmail(value);
              }}
            />

            <Button
              color="primary"
              type="submit"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? (<Spinner size="sm" color="default"/>) : t("forms.send")}
            </Button>
          </form>
        }
      </div>
    </div>
  );
}

export default SendAuthEmail;
