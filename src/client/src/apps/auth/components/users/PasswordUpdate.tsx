import AuthHeader from "@/apps/auth/components/auth/email/AuthHeader.tsx";
import Login from "@/apps/auth/components/auth/Login.tsx";
import ProfileHeader from "@/apps/auth/components/users/ProfileHeader.tsx";
import PasswordUpdateForm from "@/apps/auth/components/users/PasswordUpdateForm.tsx";
import {PASSWORD_RESET_URL, LOGIN_URL, PROFILE_URL} from "@/constants/urls.ts";
import {useAppSelector} from "@/store/hooks.ts";
import {Card, CardHeader, Link} from "@nextui-org/react";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";

interface PasswordUpdateProps {
  type: "change" | "reset"
}

const PasswordUpdate: React.FC<PasswordUpdateProps> = ({type}) => {
  const { t } = useTranslation();
  const { uid, token } = useParams<{ uid?: string; token?: string }>();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const pageTitle = type === "change" ? t("profile.changePassword")
    : t("auth.passwordReset.resetPassword");

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);
  const userData = useAppSelector((state) => state.auth.userData);

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showForm, setShowForm] = React.useState(true);

  useEffect(() => {
    if (type === "change" && !isLoggedIn) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }
  }, [type, isLoggedIn, navigate, redirectPath]);

  return (
    <>
      {!isSuccess && (
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

            {showForm && <PasswordUpdateForm type={type} uid={uid} token={token} setShowForm={setShowForm} setIsSuccess={setIsSuccess}/>}

            {!showForm && type === "reset" && (
              <CardHeader className="flex flex-col pt-0 pb-0">
                <p className="text-center text-danger">
                  {t("auth.passwordReset.invalidLink")}&nbsp;
                  <Link href={PASSWORD_RESET_URL}>{t("auth.passwordReset.resendLink")}</Link>
                </p>
              </CardHeader>
            )}
          </Card>
        </div>
      )}
      {isSuccess && type === "reset" && <Login isEmailLoginSelected headerMessageText={t("auth.passwordReset.success")}/>}
    </>
  );
}

export default PasswordUpdate;
