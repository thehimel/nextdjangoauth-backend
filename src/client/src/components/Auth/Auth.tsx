"use client";

import {EyeClosedIcon, EyeOpenIcon} from "@/components/icons/eyes.tsx";
import {LOGIN_URL, PROFILE_URL, SIGNUP_URL} from "@/components/utils/constants.ts";
import {InitialSignupResponse, auth, SignupResponseInterface} from "@/store/auth/authActions.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidEmail, isValidPassword, validateField} from "@/utils/validate.ts";
import React, {FC, FormEvent} from "react";
import {Button, Input, Checkbox, Link, Divider, Spinner} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "@/components/icons/acme.tsx";
import {useLocation, useNavigate} from "react-router-dom";

interface AuthProps {
  pageType: "signup" | "login" | "confirm-email";
  headline: string;
}

const Auth: FC<AuthProps> = ({pageType, headline}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || PROFILE_URL; // Default to profile page if no specific redirect

  const dispatch: AppDispatch = useAppDispatch();
  const isSignupPage = pageType === "signup";
  const isLoginPage = pageType === "login";

  const [isLoading, setIsLoading] = React.useState(false);
  const [isRememberMe, setIsRememberMe] = React.useState(true);

  const [isAgree, setIsAgree] = React.useState(true);
  const isAgreeErrorMessage = "You must agree to the Terms and Privacy Policy to continue.";

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");

  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = React.useState(true);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const [isSignupSuccessful, setIsSignupSuccessful] = React.useState(false);

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

    // Confirm Password validation
    if (isSignupPage) {
      if (!isAgree) {
        isFormValid = false;
      }
      if (!isValidPassword(confirmPassword)) {
        setIsConfirmPasswordValid(false);
        setConfirmPasswordErrorMessage("Enter a valid password.");
        isFormValid = false;
      } else if (confirmPassword !== password) {
        setIsConfirmPasswordValid(false);
        setConfirmPasswordErrorMessage("Passwords do not match.");
        isFormValid = false;
      } else {
        setConfirmPasswordErrorMessage("")
        setIsConfirmPasswordValid(true);
      }
    }

    // If the form is valid, proceed with the next steps
    if (isFormValid) {
      setIsLoading(true);

      let response: SignupResponseInterface = InitialSignupResponse;
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
          setPasswordErrorMessage("Unable to log in with provided credentials.");
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center pb-2">
        <AcmeIcon size={60} />
        <p className="text-xl font-medium">Welcome</p>
        <p className="text-small text-default-500">{headline}</p>
      </div>
      {!isSignupSuccessful ? (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
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
            <Input
              isRequired
              endContent={
                <button type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                </button>
              }
              label="Password"
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
                label="Confirm Password"
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
                  onValueChange={(value) => setIsAgree(value)}>
                  I agree with the&nbsp;
                  <Link href="#" size="sm">Terms</Link>&nbsp;and&nbsp;<Link href="#" size="sm">Privacy Policy</Link>
                </Checkbox>
                {!isAgree ? <p className="text-small text-danger pb-2">{isAgreeErrorMessage}</p> : null}
              </>
            ) : (
              <div className="flex items-center justify-between px-1 py-2">
                <Checkbox
                  name="remember"
                  size="sm"
                  isInvalid={!isRememberMe}
                  isDisabled={isLoading}
                  defaultSelected={isRememberMe}
                  onValueChange={(value) => setIsRememberMe(value)}>
                  Remember me
                </Checkbox>
                <Link className="text-default-500" href="#" size="sm">
                  Forgot password?
                </Link>
              </div>
            )}
            <Button
              color="primary"
              type="submit"
              isDisabled={isLoading}
              endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}>
              {isSignupPage ? "Sign Up" : "Log in"}
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button isDisabled={isLoading} startContent={<Icon icon="flat-color-icons:google" width={24} />}>
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-small">
            {isSignupPage ? (
              <>Already have an account?&nbsp;<Link href={LOGIN_URL} size="sm">Log In</Link></>
            ) : (
              <>Need to create an account?&nbsp; <Link href={SIGNUP_URL} size="sm">Sign Up</Link></>
            )}
          </p>
        </div>
        ) : (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p>Thanks for signing up. Please check your inbox to verify the email.</p>
        </div>
      )}
    </div>
  );
}

export default Auth;
