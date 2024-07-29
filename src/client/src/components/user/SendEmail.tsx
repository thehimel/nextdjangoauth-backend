"use client";

import {resendEmailVerification} from "@/store/auth/authActions.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidEmail, validateField} from "@/utils/validate.ts";
import {Button, Spinner} from "@nextui-org/react";

import {Input} from "@nextui-org/react";
import React, {FC, FormEvent} from "react";

export interface MessageProps {
  text: string;
  color: "default" | "success" | "warning" | "danger";
}

interface SendEmailProps {
  pageType: "resend_email_verification" | "reset_password";
}

const SendEmail: FC<SendEmailProps> = ({pageType}) => {
  const dispatch: AppDispatch = useAppDispatch();

  const isResendEmailVerificationPage = pageType === "resend_email_verification";
  const isResetPassword = pageType === "reset_password";

  const initialHeadline: MessageProps = {
    text: isResendEmailVerificationPage ?
      "Email verification failed. However, you can resend the confirmation email." :
      isResetPassword ? "Enter your email to reset password." : "Invalid request.",
    color: isResendEmailVerificationPage ? "danger" : "default",
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const [headlineText, setHeadlineText] = React.useState(initialHeadline.text);
  const [headlineColor, setHeadlineColor] = React.useState(initialHeadline.color);

  const [email, setEmail] = React.useState("");
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setHeadlineColor("default");
    let isFormValid = true;

    isFormValid = validateField({
      isValid: isValidEmail(email),
      setIsFieldValid: setIsEmailValid,
      setFieldErrorMessage: setEmailErrorMessage,
      errorMessage: "Enter a valid email.",
    }) && isFormValid;

    if (isFormValid) {
      setIsLoading(true);
      const params = {email}
      const response = await dispatch(resendEmailVerification(params));

      if (response.success) {
        setIsEmailSent(true);
        setHeadlineColor("success");
        if (isResendEmailVerificationPage) {
          setHeadlineText("Verification email sent successfully. Please check your inbox to verify the email.")
        } else {
          setHeadlineText("Email sent with a link to reset password. Please check your inbox.")
        }
      } else {
        const emailError = response.errors.data.email;
        if (emailError !== "") {
          setIsEmailValid(false);
          setEmailErrorMessage(response.errors.data.email);
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <p className={`text-${headlineColor}`}>{headlineText}</p>
        {!isEmailSent &&
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input
              autoFocus
              isRequired
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              variant="bordered"
              errorMessage={!isEmailValid ? emailErrorMessage : undefined}
              isInvalid={!isEmailValid}
              isDisabled={isLoading}
              value={email}
              onValueChange={(value) => {
                setIsEmailValid(true);
                setEmail(value);
              }}
            />

            <Button
              color="primary"
              type="submit"
              isDisabled={isLoading}
              endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}>
              Send
            </Button>
          </form>
        }
      </div>
    </div>
  );
}

export default SendEmail;

