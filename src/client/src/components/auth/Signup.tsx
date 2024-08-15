import AuthDivider from "@/components/auth/email/AuthDivider.tsx";
import AuthHeader from "@/components/auth/email/AuthHeader.tsx";
import EmailSignUp from "@/components/auth/email/EmailSignUp.tsx";
import GoogleAuth from "@/components/auth/google/GoogleAuth.tsx";
import TermsAndPrivacyPolicy from "@/components/auth/TermsAndPrivacyPolicy.tsx";
import {LOGIN_URL} from "@/constants/urls.ts";
import {signup} from "@/store/auth/actions/auth.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const Signup = () => {
  const { t } = useTranslation();
  const [isSignupSuccess, setIsSignupSuccess] = React.useState(false);
  const onSignupSuccessChange = (value: boolean) => setIsSignupSuccess(value);

  const header = <AuthHeader title={t("common.welcome")} message={{text: t("auth.signup.createAccount")}}/>

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {header}
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {isSignupSuccess ? (
          <p>{t("auth.signup.thanksForSigningUp")}</p>
        ) : (
          <>
            <GoogleAuth type={signup}/>
            <AuthDivider/>
            <EmailSignUp onSignupSuccessChange={onSignupSuccessChange}/>
            <TermsAndPrivacyPolicy/>
          </>
        )}
      </div>
      {!isSignupSuccess && (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p className="text-center">
            {t("auth.login.alreadyHaveAccount")}&nbsp;
            <Link to={LOGIN_URL} className="text-primary">
              {t("navigation.login")}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Signup;
