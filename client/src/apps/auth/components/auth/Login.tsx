import AuthDivider from "@/apps/auth/components/auth/email/AuthDivider.tsx";
import AuthHeader from "@/apps/auth/components/auth/email/AuthHeader.tsx";
import EmailLogin from "@/apps/auth/components/auth/email/EmailLogin.tsx";
import GoogleAuth from "@/apps/auth/components/auth/google/GoogleAuth.tsx";
import {EMAIL_AUTH, EMAIL_AUTH_PRESELECTED, GOOGLE_AUTH} from "@/apps/auth/config/settings.ts";
import {SIGNUP_URL} from "@/apps/auth/urls/client.ts";
import {login} from "@/apps/auth/store/actions/auth.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

interface LoginProps {
  isEmailLoginSelected?: boolean;
  headerMessageText?: string;
}

const Login: React.FC<LoginProps> = ({isEmailLoginSelected = EMAIL_AUTH_PRESELECTED, headerMessageText}) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
     <AuthHeader
       title={t("base.general.welcome")}
       message={{text: headerMessageText || t("auth.login.info.loginToAccount")}}
     />
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {!isEmailLoginSelected && (
          <>
            {GOOGLE_AUTH && <GoogleAuth type={login}/>}
            {EMAIL_AUTH && GOOGLE_AUTH && <AuthDivider/>}
          </>
        )}
        {EMAIL_AUTH && <EmailLogin isEmailLoginSelected={isEmailLoginSelected}/>}
      </div>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <p className="text-center">
          {t("auth.signup.labels.needToCreateAccount")}&nbsp;
          <Link to={SIGNUP_URL} className="text-primary">
            {t("auth.signup.navigation.base")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
