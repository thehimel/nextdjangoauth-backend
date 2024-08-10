"use client";

import Auth from "@/components/auth/Auth.tsx";
import AuthHeader from "@/components/auth/AuthHeader.tsx";
import {EyeClosedIcon, EyeOpenIcon} from "@/components/icons/eyes.tsx";
import ProfileHeader from "@/components/user/ProfileHeader.tsx";
import ProfileFooter from "@/components/user/ProfileFooter.tsx";
import {FORGOT_PASSWORD_URL, LOGIN_URL, PROFILE_URL} from "@/constants/urls.ts";
import {
  updatePassword,
  UpdatePasswordInterface,
  UpdatePasswordResponseInterface,
} from "@/store/auth/actions/updatePassword.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {handleLogout} from "@/utils/logout.ts";
import {isValidPassword, validateField} from "@/utils/validate.ts";

import {Card, CardBody, CardHeader, Input, Link} from "@nextui-org/react";
import React, {FC, FormEvent, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "sonner";

interface UpdatePasswordProps {
  isChangePassword?: boolean,
  isResetPassword?: boolean,
}

const UpdatePassword: FC<UpdatePasswordProps> = ({isChangePassword = false, isResetPassword = false}) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { uid, token } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const pageTitle = isChangePassword ? t("profile.changePassword")
    : isResetPassword ? t("auth.passwordReset.resetPassword") : t("common.welcome");

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);

  const [isResetPasswordSuccessful, setIsResetPasswordSuccessful] = React.useState(false);
  const [isResetPasswordDone, setIsResetPasswordDone] = React.useState(false);
  const [showCard, setShowCard] = React.useState(true);
  const [showForm, setShowForm] = React.useState(true);

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
    if (isChangePassword && !isLoggedIn) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }
  }, [isChangePassword, isLoggedIn, navigate, redirectPath]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let isFormValid = true;

    isFormValid = validateField({
      isValid: isValidPassword(password),
      setIsFieldValid: setIsPasswordValid,
      setFieldErrorMessage: setPasswordErrorMessage,
      errorMessage: t("errors.invalidPassword"),
    }) && isFormValid;

    isFormValid = validateField({
      isValid: isValidPassword(confirmPassword) && confirmPassword === password,
      setIsFieldValid: setIsConfirmPasswordValid,
      setFieldErrorMessage: setConfirmPasswordErrorMessage,
      errorMessage: confirmPassword !== password ? t("errors.passwordMismatch") : t("errors.invalidPassword")
    }) && isFormValid;

    if (isFormValid) {
      setIsLoading(true);
      const params: UpdatePasswordInterface = {isChangePassword, isResetPassword, access, password, confirmPassword, uid, token}
      const response: UpdatePasswordResponseInterface = await dispatch(updatePassword(params));

      if (!response.isTokenValid) {
        if (isChangePassword) {
          navigate(LOGIN_URL, { state: { from: redirectPath } });
        } else if (isResetPassword) {
          setShowForm(false);
          setIsResetPasswordDone(true);
          setIsResetPasswordSuccessful(false);
        }
      }

      if (response.success) {
        toast.success(t("auth.passwordReset.updateSuccess"))
        if (isResetPassword) {
          setShowCard(false);
          setIsResetPasswordDone(true);
          setIsResetPasswordSuccessful(true);
        } else {
          await handleLogout(dispatch);
        }
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

  return (
    <>
      {showCard && (
        <div className={`w-full flex flex-col ${isResetPassword ? 'max-w-sm' : 'max-w-xl'}`}>
          {isResetPassword && <AuthHeader title={t("auth.passwordReset.resetPassword")}/>}
          <Card className="p-6 mt-2">
            {isChangePassword && (
              <ProfileHeader
                title={pageTitle}
                firstName={firstName}
                lastName={lastName}
                email={email}
                navigationLink={{url: PROFILE_URL, title: t("profile.updateProfile")}}
              />
            )}
            {isResetPasswordDone && !isResetPasswordSuccessful && (
              <CardHeader className="flex flex-col pt-0 pb-0">
                <p className="text-center text-danger">
                  {t("auth.passwordReset.invalidLink")}&nbsp;
                  <Link href={FORGOT_PASSWORD_URL}>{t("auth.passwordReset.resendLink")}</Link>
                </p>
              </CardHeader>
            )}
            {showForm && (
              <form onSubmit={handleSubmit}>
                <CardBody className="grid grid-cols-1 gap-4">
                  <Input
                    isRequired
                    endContent={
                      <button type="button" onClick={togglePasswordVisibility}>
                        {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                      </button>
                    }
                    label={t("forms.newPassword")}
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
                    label={t("forms.confirmNewPassword")}
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
                <ProfileFooter title={t("forms.save")} isLoading={isLoading} isDisabled={isSubmitDisabled}/>
              </form>
            )}
          </Card>
        </div>
      )}
      {isResetPasswordSuccessful && (
        <Auth pageType={"login"} headline={t("auth.passwordReset.success")}/>
      )}
    </>
  );
}

export default UpdatePassword;
