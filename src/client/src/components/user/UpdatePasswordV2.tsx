import AuthHeader from "@/components/auth/email/AuthHeader.tsx";
import PasswordInputField, {TPasswordInputRegister} from "@/components/auth/email/fields/PasswordInputField.tsx";
import Login from "@/components/auth/Login.tsx";
import ProfileFooter from "@/components/user/ProfileFooter.tsx";
import ProfileHeader from "@/components/user/ProfileHeader.tsx";
import {FORGOT_PASSWORD_URL, LOGIN_URL, PROFILE_URL} from "@/constants/urls.ts";
import {TUpdatePasswordSchema, updatePasswordSchema} from "@/schemas/auth.ts";
import {
  updatePasswordV2,
  UpdatePasswordV2Interface,
  UpdatePasswordV2ResponseInterface,
} from "@/store/auth/actions/updatePasswordV2.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {handleLogout} from "@/utils/logout.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardBody, CardHeader, Link} from "@nextui-org/react";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "sonner";

interface UpdatePasswordV2Props {
  type: "change" | "reset"
}

const UpdatePasswordV2: React.FC<UpdatePasswordV2Props> = ({type}) => {
  const { t } = useTranslation();
  const { uid, token } = useParams();
  const dispatch: AppDispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const pageTitle = type === "change" ? t("profile.changePassword")
    : t("auth.passwordReset.resetPassword");

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const userData = useAppSelector((state) => state.auth.userData);

  const [isResetPasswordSuccessful, setIsResetPasswordSuccessful] = React.useState(false);
  const [isResetPasswordDone, setIsResetPasswordDone] = React.useState(false);
  const [showCard, setShowCard] = React.useState(true);
  const [showForm, setShowForm] = React.useState(true);

  useEffect(() => {
    if (type === "change" && !isLoggedIn) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }
  }, [type, isLoggedIn, navigate, redirectPath]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema(t)),
  });

  const onSubmit = async (data: TUpdatePasswordSchema) => {
    const params: UpdatePasswordV2Interface = {
      access: userData.access,
      password: data.password,
      confirmPassword: data.confirmPassword,
      uid: uid,
      token: token,
      type: type
    }

    const response: UpdatePasswordV2ResponseInterface = await dispatch(updatePasswordV2(params));

    if (!response.isTokenValid) {
      if (type === "change") {
        navigate(LOGIN_URL, { state: { from: redirectPath } });
      } else {
        setShowForm(false);
        setIsResetPasswordDone(true);
        setIsResetPasswordSuccessful(false);
      }
    }

    if (response.success) {
      toast.success(t("auth.passwordReset.updateSuccess"))
      if (type === "change") {
        await handleLogout(dispatch);
      } else {
        setShowCard(false);
        setIsResetPasswordDone(true);
        setIsResetPasswordSuccessful(true);
      }
      return;
    }

    const errors = response.errors;
    if (!errors) {
      toast.error(t("errors.unexpectedError"));
      return;
    }

    (Object.keys(errors) as Array<keyof TUpdatePasswordSchema>).forEach((key) => {
      if (errors[key]) {
        setError(key, {
          type: "server",
          message: errors[key] || t("errors.unexpectedError"),
        });
      }
    });
  };

  return (
    <>
      {showCard && (
        <div className={`w-full flex flex-col ${type === "reset" ? 'max-w-sm' : 'max-w-xl'}`}>
          {type === "reset" && <AuthHeader title={t("auth.passwordReset.resetPassword")}/>}
          <Card className="p-6 mt-2">
            {type === "change" && (
              <ProfileHeader
                title={pageTitle}
                firstName={userData.user.first_name}
                lastName={userData.user.last_name}
                email={userData.user.email}
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody className="grid grid-cols-1 gap-4">
                  <PasswordInputField
                    register={register as TPasswordInputRegister}
                    errorMessage={errors["password"]?.message}
                    isSubmitting={isSubmitting}
                    type={"password"}
                    label={t("forms.newPassword")}
                  />
                  <PasswordInputField
                    register={register as TPasswordInputRegister}
                    errorMessage={errors["confirmPassword"]?.message}
                    isSubmitting={isSubmitting}
                    type={"confirmPassword"}
                    label={t("forms.confirmNewPassword")}
                  />
                </CardBody>
                <ProfileFooter title={t("forms.save")} isLoading={isSubmitting} isDisabled={isSubmitting}/>
              </form>
            )}
          </Card>
        </div>
      )}
      {isResetPasswordSuccessful && (
        <Login isEmailLoginSelected headerMessageText={t("auth.passwordReset.success")}/>
      )}
    </>
  );
}

export default UpdatePasswordV2;
