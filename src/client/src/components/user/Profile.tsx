"use client";

import ProfileHeader from "@/components/user/ProfileHeader.tsx";
import {CHANGE_PASSWORD_URL, LOGIN_URL} from "@/components/utils/constants.ts";
import {updateProfile} from "@/store/auth/authActions.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {isValidUsername} from "@/utils/validate.ts";
import {CardProps, Spinner} from "@nextui-org/react";

import {Card, CardBody, Button, Input, CardFooter} from "@nextui-org/react";
import React, {FormEvent, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const Profile = (props: CardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);

  const dispatch: AppDispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

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
      // Store the path to redirect to after login
      const redirectPath = location.pathname;
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }
  }, [isLoggedIn, navigate, location]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let isFormValid = true;

    if (!isValidUsername(username)) {
      setIsUsernameValid(false);
      setUsernameErrorMessage("Username must be minimum 6 characters, letters & numbers only.");
      isFormValid = false;
    } else {
      setUsernameErrorMessage("");
      setIsUsernameValid(true);
    }

    if (!firstName.length) {
      setIsFirstNameValid(false);
      setFirstNameErrorMessage("Enter a valid first name.");
      isFormValid = false;
    } else {
      setFirstNameErrorMessage("");
      setIsFirstNameValid(true);
    }

    if (!lastName.length) {
      setIsLastNameValid(false);
      setLastNameErrorMessage("Enter a valid first name.");
      isFormValid = false;
    } else {
      setLastNameErrorMessage("");
      setIsLastNameValid(true);
    }

    if (isFormValid) {
      setIsLoading(true);
      const params = {access, email, firstName, lastName, ...(previousUsername !== username && { username })}
      const response = await dispatch(updateProfile(params));

      if (!response.isTokenValid) {
        const redirectPath = location.pathname;
        navigate(LOGIN_URL, { state: { from: redirectPath } });
      }

      if (!response.success) {
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
      <Card className="max-w-xl p-2" {...props}>
        <ProfileHeader
          title={"Account Details"}
          firstName={firstName}
          lastName={lastName}
          email={email}
          navigationLink={{url: CHANGE_PASSWORD_URL, title: "Change Password"}}
        />
        <form onSubmit={handleSubmit}>
          <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              isRequired
              label="Username"
              name="username"
              autoComplete="username"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder="Enter username"
              errorMessage={!isUsernameValid ? usernameErrorMessage : undefined}
              isInvalid={!isUsernameValid}
              isDisabled={isLoading}
              value={username}
              onValueChange={(value) => {
                setIsUsernameValid(true);
                setUsername(value);
              }}
            />
            <Input
              readOnly
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter email"
              isDisabled={isLoading}
              value={email}
            />
            <Input
              isRequired
              label="First Name"
              name="firstName"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder="Enter first name"
              errorMessage={!isFirstNameValid ? firstNameErrorMessage : undefined}
              isInvalid={!isFirstNameValid}
              isDisabled={isLoading}
              value={firstName}
              onValueChange={(value) => {
                setIsFirstNameValid(true);
                setFirstName(value);
              }}
            />
            <Input
              isRequired
              label="Last Name"
              name="lastName"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder="Enter last name"
              errorMessage={!isLastNameValid ? lastNameErrorMessage : undefined}
              isInvalid={!isLastNameValid}
              isDisabled={isLoading}
              value={lastName}
              onValueChange={(value) => {
                setIsLastNameValid(true);
                setLastName(value);
              }}
            />
          </CardBody>
          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              color="primary"
              type="submit"
              radius="full"
              isDisabled={isLoading}
              endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}
            >
              Update
            </Button>
          </CardFooter>
        </form>
    </Card>
  ) : null;
}

export default Profile;
