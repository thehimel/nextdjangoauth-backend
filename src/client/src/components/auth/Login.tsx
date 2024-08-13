import AuthDivider from "@/components/auth/AuthDivider.tsx";
import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailLogin from "@/components/auth/EmailLogin.tsx";
import GoogleAuth from "@/components/auth/GoogleAuth.tsx";
import {SIGNUP_URL} from "@/constants/urls.ts";
import {login} from "@/store/auth/actions/authV2.ts";
import {Link} from "@nextui-org/react";
import {useTranslation} from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  const header = <AuthHeader title={t("common.welcome")} message={{text: t("auth.login.loginToAccount")}}/>

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {header}
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <GoogleAuth type={login}/>
        <AuthDivider/>
        <EmailLogin/>
      </div>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <p className="text-center">
          {t("auth.signup.needToCreateAccount")}&nbsp;<Link href={SIGNUP_URL} size="md">{t("navigation.signup")}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
