"use client";

import ProfileHeader from "@/components/user/ProfileHeader.tsx";
import ProfileFooter from "@/components/user/ProfileFooter.tsx";
import {CHANGE_PASSWORD_URL, LOGIN_URL} from "@/constants/urls.ts";
import {UpdateProfileResponseInterface, updateProfile, UpdateProfileInterface} from "@/store/auth/actions/updateProfile.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidUsername, validateField} from "@/utils/validate.ts";
import {CardProps} from "@nextui-org/react";

import {Card, CardBody, Input} from "@nextui-org/react";
import React, {FormEvent, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

const Profile = (props: CardProps) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);

  const previousUsername = useAppSelector((state) => state.auth.userData.user.username);
  const [username, setUsername] = React.useState(previousUsername);
  const email = useAppSelector((state) => state.auth.userData.user.email);
  const access = useAppSelector((state) => state.auth.userData.access);

  const [firstName, setFirstName] = React.useState(useAppSelector((state) => state.auth.userData.user.first_name));
  const [lastName, setLastName] = React.useState(useAppSelector((state) => state.auth.userData.user.last_name));

  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");

  const [isUsernameValid, setIsUsernameValid] = React.useState(true);
  const [isFirstNameValid, setIsFirstNameValid] = React.useState(true);
  const [isLastNameValid, setIsLastNameValid] = React.useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }
  }, [isLoggedIn, navigate, redirectPath]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitDisabled(true);

    let isFormValid = true;

    isFormValid = validateField({
      isValid: isValidUsername(username),
      setIsFieldValid: setIsUsernameValid,
      setFieldErrorMessage: setUsernameErrorMessage,
      errorMessage: t("errors.invalidUsername"),
    }) && isFormValid;

    isFormValid = validateField({
      isValid: firstName.length > 0,
      setIsFieldValid: setIsFirstNameValid,
      setFieldErrorMessage: setFirstNameErrorMessage,
      errorMessage: t("errors.invalidFirstName"),
    }) && isFormValid;

    isFormValid = validateField({
      isValid: lastName.length > 0,
      setIsFieldValid: setIsLastNameValid,
      setFieldErrorMessage: setLastNameErrorMessage,
      errorMessage: t("errors.invalidLastName"),
    }) && isFormValid;

    if (isFormValid) {
      setIsLoading(true);
      const params: UpdateProfileInterface = {access, firstName, lastName, ...(previousUsername !== username && { username })}
      const response: UpdateProfileResponseInterface = await dispatch(updateProfile(params));

      if (!response.isTokenValid) {
        navigate(LOGIN_URL, { state: { from: redirectPath } });
      }

      if (response.success) {
        toast.success(t("profile.updateSuccess"));
      } else {
        const usernameError = response.errors.data.username;
        const firstNameError = response.errors.data.firstName;
        const lastNameError = response.errors.data.lastName;

        if (usernameError !== "") {
          setIsUsernameValid(false);
          setUsernameErrorMessage(usernameError);
        }

        if (firstNameError !== "") {
          setIsFirstNameValid(false);
          setFirstNameErrorMessage(firstNameError);
        }

        if (lastNameError !== "") {
          setIsLastNameValid(false);
          setLastNameErrorMessage(lastNameError);
        }
      }
      setIsLoading(false);
    }
  };

  return isLoggedIn ? (
      <Card className="w-full max-w-xl p-6 mt-2" {...props}>
        <ProfileHeader
          title={t("profile.accountDetails")}
          firstName={firstName}
          lastName={lastName}
          email={email}
          navigationLink={{url: CHANGE_PASSWORD_URL, title: t("profile.changePassword")}}
        />
        <form onSubmit={handleSubmit}>
          <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <Input
                isRequired
                label={t("forms.username")}
                name="username"
                autoComplete="username"
                labelPlacement="outside"
                type="text"
                variant="bordered"
                placeholder={t("placeholders.username")}
                errorMessage={!isUsernameValid ? usernameErrorMessage : undefined}
                isInvalid={!isUsernameValid}
                isDisabled={isLoading}
                value={username}
                onValueChange={(value) => {
                  setIsUsernameValid(true);
                  setUsername(value);
                  setIsSubmitDisabled(false);
                }}
              />
            </div>
            <Input
              isRequired
              label={t("forms.firstName")}
              name="firstName"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder={t("placeholders.firstName")}
              errorMessage={!isFirstNameValid ? firstNameErrorMessage : undefined}
              isInvalid={!isFirstNameValid}
              isDisabled={isLoading}
              value={firstName}
              onValueChange={(value) => {
                setIsFirstNameValid(true);
                setFirstName(value);
                setIsSubmitDisabled(false);
              }}
            />
            <Input
              isRequired
              label={t("forms.lastName")}
              name="lastName"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder={t("placeholders.lastName")}
              errorMessage={!isLastNameValid ? lastNameErrorMessage : undefined}
              isInvalid={!isLastNameValid}
              isDisabled={isLoading}
              value={lastName}
              onValueChange={(value) => {
                setIsLastNameValid(true);
                setLastName(value);
                setIsSubmitDisabled(false);
              }}
            />
          </CardBody>
          <ProfileFooter title={"Save"} isLoading={isLoading} isDisabled={isSubmitDisabled} />
        </form>
    </Card>
  ) : null;
}

export default Profile;
