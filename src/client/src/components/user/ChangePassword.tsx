"use client";

import {EyeClosedIcon, EyeOpenIcon} from "@/components/icons/eyes.tsx";
import ProfileHeader from "@/components/user/ProfileHeader.tsx";
import ProfileFooter from "@/components/user/ProfileFooter.tsx";
import {LOGIN_URL, PROFILE_URL} from "@/constants/urls.ts";
import {changePassword} from "@/store/auth/authActions.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidPassword, validateField} from "@/utils/validate.ts";
import {CardProps} from "@nextui-org/react";

import {Card, CardBody, Input} from "@nextui-org/react";
import React, {FormEvent, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

const ChangePassword = (props: CardProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);

  const access = useAppSelector((state) => state.auth.userData.access);
  const email = useAppSelector((state) => state.auth.userData.user.email);
  const firstName = useAppSelector((state) => state.auth.userData.user.first_name);
  const lastName = useAppSelector((state) => state.auth.userData.user.last_name);

  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = React.useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const [password, setPassword] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }
  }, [isLoggedIn, navigate, redirectPath]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let isFormValid = true;

    isFormValid = validateField({
      isValid: isValidPassword(password),
      setIsFieldValid: setIsPasswordValid,
      setFieldErrorMessage: setPasswordErrorMessage,
      errorMessage: "Enter a valid password.",
    }) && isFormValid;

    isFormValid = validateField({
      isValid: isValidPassword(confirmPassword) && confirmPassword === password,
      setIsFieldValid: setIsConfirmPasswordValid,
      setFieldErrorMessage: setConfirmPasswordErrorMessage,
      errorMessage: confirmPassword !== password ? "Passwords do not match." : "Enter a valid password."
    }) && isFormValid;

    if (isFormValid) {
      setIsLoading(true);
      const params = {access, password, confirmPassword}
      const response = await dispatch(changePassword(params));

      if (!response.isTokenValid) {
        navigate(LOGIN_URL, { state: { from: redirectPath } });
      }

      if (response.success) {
        toast.success("Password changed successfully.")
      } else {
        const passwordError = response.errors.data.password || response.errors.data.confirmPassword;
        const confirmPasswordError = response.errors.data.confirmPassword;

        if (passwordError) {
          setIsPasswordValid(false);
          setPasswordErrorMessage(passwordError);
        }

        if (confirmPasswordError) {
          setIsConfirmPasswordValid(false);
          setConfirmPasswordErrorMessage(confirmPasswordError);
        }
      }
      setIsSubmitDisabled(true);
      setIsLoading(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  return isLoggedIn ? (
      <Card className="max-w-xl p-2" {...props}>
        <ProfileHeader
          title={"Account Details"}
          firstName={firstName}
          lastName={lastName}
          email={email}
          navigationLink={{url: PROFILE_URL, title: "Update Profile"}}
        />
        <form onSubmit={handleSubmit}>
          <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              isRequired
              endContent={
                <button type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                </button>
              }
              label="New Password"
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
                setIsSubmitDisabled(false);
              }}
            />
            <Input
                isRequired
                endContent={
                  <button type="button" onClick={toggleConfirmPasswordVisibility}>
                    {isConfirmPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                  </button>
                }
                label="Confirm New Password"
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
                  setIsSubmitDisabled(false);
                }}
              />
          </CardBody>
          <ProfileFooter title={"Save"} isLoading={isLoading} isDisabled={isSubmitDisabled} />
        </form>
    </Card>
  ) : null;
}

export default ChangePassword;
