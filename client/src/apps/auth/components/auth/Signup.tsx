import AuthDivider from "@/apps/auth/components/auth/email/AuthDivider.tsx";
import AuthHeader from "@/apps/auth/components/auth/email/AuthHeader.tsx";
import EmailSignUp from "@/apps/auth/components/auth/email/EmailSignUp.tsx";
import GoogleAuth from "@/apps/auth/components/auth/google/GoogleAuth.tsx";
import TermsAndPrivacyPolicy from "@/apps/auth/components/auth/TermsAndPrivacyPolicy.tsx";
import {EMAIL_AUTH, GOOGLE_AUTH} from "@/apps/auth/config/settings.ts";
import {LOGIN_URL} from "@/apps/auth/urls/client.ts";
import {signup} from "@/apps/auth/store/actions/auth.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const Signup = () => {
  const { t } = useTranslation();
  const [isSignupSuccess, setIsSignupSuccess] = React.useState(false);
  const onSignupSuccessChange = (value: boolean) => setIsSignupSuccess(value);

  const header = <AuthHeader title={t("base.general.welcome")} message={{text: t("auth.signup.info.createAccount")}}/>

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {header}
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {isSignupSuccess ? (
          <p>{t("auth.signup.messages.thanksForSigningUp")}</p>
        ) : (
          <>
            {GOOGLE_AUTH && <GoogleAuth type={signup}/>}
            {EMAIL_AUTH && GOOGLE_AUTH && <AuthDivider/>}
            {EMAIL_AUTH && <EmailSignUp onSignupSuccessChange={onSignupSuccessChange}/>}
            <TermsAndPrivacyPolicy/>
          </>
        )}
      </div>
      {!isSignupSuccess && (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p className="text-center">
            {t("auth.login.labels.alreadyHaveAccount")}&nbsp;
            <Link to={LOGIN_URL} className="text-primary">
              {t("auth.login.navigation.base")}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Signup;
