import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailSignup from "@/components/auth/EmailSignup.tsx";
import GoogleAuth from "@/components/auth/GoogleAuth.tsx";
import IsAgree from "@/components/auth/IsAgree.tsx";
import React from "react";
import {useTranslation} from "react-i18next";

const AuthV2 = () => {
  const { t } = useTranslation();
  const [isSignupSuccess, setIsSignupSuccess] = React.useState(false);
  const onSignupSuccessChange = (value: boolean) => setIsSignupSuccess(value);
  // const [isEmailSignup, setIsEmailSignup] = React.useState(false);

  const [isAgree, setIsAgree] = React.useState(true);
  const onAgreeChange = (value: boolean) => setIsAgree(value);

  const header = <AuthHeader title={t("common.welcome")} message={{text: t("auth.signup.createAccount")}}/>

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {header}
      {!isSignupSuccess ? (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <EmailSignup isAgree={isAgree} onSignupSuccessChange={onSignupSuccessChange}/>
          <GoogleAuth isDisabled={!isAgree}/>
          <IsAgree isAgree={isAgree} onAgreeChange={onAgreeChange}/>
        </div>
      ) : (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p>{t("auth.signup.thanksForSigningUp")}</p>
        </div>
      )}
    </div>
  );
}

export default AuthV2;
