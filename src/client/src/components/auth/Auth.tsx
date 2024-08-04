"use client";

import AuthHeader from "@/components/auth/AuthHeader.tsx";
import {EyeClosedIcon, EyeOpenIcon} from "@/components/icons/eyes.tsx";
import {CHANGE_PASSWORD_URL, FORGOT_PASSWORD_URL, HOME_URL, LOGIN_URL, SIGNUP_URL} from "@/constants/urls.ts";
import {InitialAuthResponse, auth, AuthResponseInterface} from "@/store/auth/actions/auth.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidEmail, isValidPassword, validateField} from "@/utils/validate.ts";
import React, {FC, FormEvent} from "react";
import {Button, Input, Checkbox, Link, Divider, Spinner} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import {useTranslation} from "react-i18next";

import {useLocation, useNavigate} from "react-router-dom";

interface AuthProps {
  pageType: "signup" | "login" | "reset_password";
  headline: string;
}

const Auth: FC<AuthProps> = ({pageType, headline}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useAppDispatch();
  const { t } = useTranslation();

  const from = location.state?.from === CHANGE_PASSWORD_URL ? HOME_URL : (location.state?.from || HOME_URL);

  const isSignupPage = pageType === "signup";
  const isLoginPage = pageType === "login";

  const [isLoading, setIsLoading] = React.useState(false);
  const [isRememberMe, setIsRememberMe] = React.useState(true);
  const [isSignupSuccessful, setIsSignupSuccessful] = React.useState(false);
  const [isAgree, setIsAgree] = React.useState(true);

  const [email, setEmail] = React.useState("");
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);

  const [password, setPassword] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = React.useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let isFormValid = true;

    isFormValid = validateField({
      isValid: isValidEmail(email),
      setIsFieldValid: setIsEmailValid,
      setFieldErrorMessage: setEmailErrorMessage,
      errorMessage: "Enter a valid email.",
    }) && isFormValid;

    isFormValid = validateField({
      isValid: isValidPassword(password),
      setIsFieldValid: setIsPasswordValid,
      setFieldErrorMessage: setPasswordErrorMessage,
      errorMessage: "Enter a valid password.",
    }) && isFormValid;

    if (isSignupPage) {
      isFormValid = isAgree && isFormValid;
      isFormValid = validateField({
        isValid: isValidPassword(confirmPassword) && confirmPassword === password,
        setIsFieldValid: setIsConfirmPasswordValid,
        setFieldErrorMessage: setConfirmPasswordErrorMessage,
        errorMessage: confirmPassword !== password ? t("errors.passwordMismatch") : t("errors.invalidPassword")
      }) && isFormValid;
    }

    if (isFormValid) {
      setIsLoading(true);

      let response: AuthResponseInterface = InitialAuthResponse;
      const params = {
        email,
        password,
        ...(isSignupPage && { confirmPassword }),
        isRememberMe,
      }

      response = await dispatch(auth(params));

      if (isSignupPage) {
        if (response.success) {
          setIsSignupSuccessful(true);
        } else {
          const emailError = response.errors.data.email;
          const passwordError = response.errors.data.password;

          if (emailError !== "") {
            setIsEmailValid(false);
            setEmailErrorMessage(response.errors.data.email);
          }

          if (passwordError !== "") {
            setIsPasswordValid(false);
            setPasswordErrorMessage(response.errors.data.password);

            setIsConfirmPasswordValid(false);
            setConfirmPasswordErrorMessage(response.errors.data.password);
          }
        }
      }

      if (isLoginPage) {
        if (response.success) {
          navigate(from, { replace: true });
        } else {
          setIsEmailValid(false);
          setEmailErrorMessage("");

          setIsPasswordValid(false);
          setPasswordErrorMessage(t("errors.invalidEmailOrPassword"));
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AuthHeader headerTitle={"Welcome"} headline={{text: headline, color: "default"}}/>
      {!isSignupSuccessful ? (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
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
              isDisabled={isLoading}
              value={email}
              onValueChange={(value) => {
                setIsEmailValid(true);
                setEmail(value);
              }}
            />
            <Input
              isRequired
              endContent={
                <button type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                </button>
              }
              label={t("forms.password")}
              name="password"
              autoComplete="new-password"
              variant="bordered"
              type={isPasswordVisible ? "text" : "password"}
              errorMessage={!isPasswordValid ? passwordErrorMessage : undefined}
              isInvalid={!isPasswordValid}
              isDisabled={isLoading}
              value={password}
              onValueChange={(value) => {
                setIsPasswordValid(true);
                setPassword(value);
              }}
            />
            {isSignupPage ? (
              <Input
                isRequired
                endContent={
                  <button type="button" onClick={toggleConfirmPasswordVisibility}>
                    {isConfirmPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                  </button>
                }
                label={t("forms.confirmPassword")}
                name="confirmPassword"
                autoComplete="new-password"
                variant="bordered"
                type={isConfirmPasswordVisible ? "text" : "password"}
                errorMessage={!isConfirmPasswordValid ? confirmPasswordErrorMessage : undefined}
                isInvalid={!isConfirmPasswordValid}
                isDisabled={isLoading}
                value={confirmPassword}
                onValueChange={(value) => {
                  setIsConfirmPasswordValid(true);
                  setConfirmPassword(value);
                }}
              />
            ) : null}
            {isSignupPage ? (
              <>
                <Checkbox
                  isRequired
                  name="agree"
                  size="sm"
                  isInvalid={!isAgree}
                  isDisabled={isLoading}
                  defaultSelected={isAgree}
                  onValueChange={(value) => setIsAgree(value)}
                >
                  {t("privacy.agreeWithThe")}&nbsp;
                  <Link href="#" size="sm">{t("privacy.terms")}</Link>&nbsp;
                  {t("common.and").toLowerCase()}&nbsp;
                  <Link href="#" size="sm">{t("privacy.privacyPolicy")}</Link>
                </Checkbox>
                {!isAgree ? <p className="text-small text-danger pb-2">{t("privacy.agreeToContinue")}</p> : null}
              </>
            ) : (
              <div className="flex items-center justify-between px-1 py-2">
                <Checkbox
                  name="remember"
                  size="sm"
                  isInvalid={!isRememberMe}
                  isDisabled={isLoading}
                  defaultSelected={isRememberMe}
                  onValueChange={(value) => setIsRememberMe(value)}
                >
                  {t("auth.login.rememberMe")}
                </Checkbox>
                <Link className="text-default-500" href={FORGOT_PASSWORD_URL} size="sm">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
            )}
            <Button
              color="primary"
              type="submit"
              isDisabled={isLoading}
              endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}>
              {isSignupPage ? t("navigation.signup") : t("navigation.login")}
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button isDisabled={isLoading} startContent={<Icon icon="flat-color-icons:google" width={24} />}>
              {t("auth.login.continueWithGoogle")}
            </Button>
          </div>
          <p className="text-center text-small">
            {isSignupPage ? (
              <>{t("auth.login.alreadyHaveAccount")}&nbsp;<Link href={LOGIN_URL} size="sm">{t("navigation.login")}</Link></>
            ) : (
              <>{t("auth.signup.needToCreateAccount")}&nbsp;<Link href={SIGNUP_URL} size="sm">{t("navigation.signup")}</Link></>
            )}
          </p>
        </div>
        ) : (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p>{t("auth.signup.thanksForSigningUp")}</p>
        </div>
      )}
    </div>
  );
}

export default Auth;
