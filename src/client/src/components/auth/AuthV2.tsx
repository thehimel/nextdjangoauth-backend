import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailSignup from "@/components/auth/EmailSignup.tsx";
import GoogleAuth from "@/components/auth/GoogleAuth.tsx";
import IsAgree from "@/components/auth/IsAgree.tsx";
import {LOGIN_URL} from "@/constants/urls.ts";
import {Link} from "@nextui-org/react";
import React from "react";
import {useTranslation} from "react-i18next";

const AuthV2 = () => {
  const { t } = useTranslation();
  const [isSignupSuccess, setIsSignupSuccess] = React.useState(false);
  const onSignupSuccessChange = (value: boolean) => setIsSignupSuccess(value);

  const [isAgree, setIsAgree] = React.useState(true);
  const onAgreeChange = (value: boolean) => setIsAgree(value);

  const header = <AuthHeader title={t("common.welcome")} message={{text: t("auth.signup.createAccount")}}/>

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {header}
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {isSignupSuccess ? (
          <p>{t("auth.signup.thanksForSigningUp")}</p>
        ) : (
          <>
            <EmailSignup isAgree={isAgree} onSignupSuccessChange={onSignupSuccessChange}/>
            <GoogleAuth isDisabled={!isAgree}/>
            <IsAgree isAgree={isAgree} onAgreeChange={onAgreeChange}/>
            <p className="text-center text-small">
              {t("auth.login.alreadyHaveAccount")}&nbsp;<Link href={LOGIN_URL} size="sm">{t("navigation.login")}</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthV2;
