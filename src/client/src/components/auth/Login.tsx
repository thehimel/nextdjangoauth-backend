import AuthDivider from "@/components/auth/email/AuthDivider.tsx";
import AuthHeader from "@/components/auth/email/AuthHeader.tsx";
import EmailLogin from "@/components/auth/email/EmailLogin.tsx";
import GoogleAuth from "@/components/auth/google/GoogleAuth.tsx";
import {SIGNUP_URL} from "@/constants/urls.ts";
import {login} from "@/store/auth/actions/authV2.ts";
import {Link} from "@nextui-org/react";
import React from "react";
import {useTranslation} from "react-i18next";

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
            <Link href={SIGNUP_URL} size="md">{t("navigation.signup")}</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;
