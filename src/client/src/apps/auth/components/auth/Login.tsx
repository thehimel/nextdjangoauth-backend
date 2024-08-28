import AuthDivider from "@/apps/auth/components/auth/email/AuthDivider.tsx";
import AuthHeader from "@/apps/auth/components/auth/email/AuthHeader.tsx";
import EmailLogin from "@/apps/auth/components/auth/email/EmailLogin.tsx";
import GoogleAuth from "@/apps/auth/components/auth/google/GoogleAuth.tsx";
import {SIGNUP_URL} from "@/apps/base/constants/urls.ts";
import {login} from "@/store/auth/actions/auth.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

interface LoginProps {
  isEmailLoginSelected?: boolean;
  headerMessageText?: string;
}

const Login: React.FC<LoginProps> = ({isEmailLoginSelected= false, headerMessageText}) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
     <AuthHeader
       title={t("common.welcome")}
       message={{text: headerMessageText || t("auth.login.loginToAccount")}}
     />
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {!isEmailLoginSelected && (
          <>
            <GoogleAuth type={login}/>
            <AuthDivider/>
          </>
        )}
        <EmailLogin isEmailLoginSelected={isEmailLoginSelected}/>
      </div>
      {!isEmailLoginSelected && (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p className="text-center">
            {t("auth.signup.needToCreateAccount")}&nbsp;
            <Link to={SIGNUP_URL} className="text-primary">
              {t("navigation.signup")}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;
