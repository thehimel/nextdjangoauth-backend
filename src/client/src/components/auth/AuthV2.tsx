import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailSignUp from "@/components/auth/EmailSignUp.tsx";
import GoogleAuth from "@/components/auth/GoogleAuth.tsx";
import TermsAndPrivacyPolicy from "@/components/auth/TermsAndPrivacyPolicy.tsx";
import {LOGIN_URL} from "@/constants/urls.ts";
import {Link} from "@nextui-org/react";
import React from "react";
import {useTranslation} from "react-i18next";

const AuthV2 = () => {
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
            <EmailSignUp onSignupSuccessChange={onSignupSuccessChange}/>
            <GoogleAuth/>
            <TermsAndPrivacyPolicy/>
          </>
        )}
      </div>
      {!isSignupSuccess && (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p className="text-center">
            {t("auth.login.alreadyHaveAccount")}&nbsp;<Link href={LOGIN_URL} size="md">{t("navigation.login")}</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default AuthV2;
