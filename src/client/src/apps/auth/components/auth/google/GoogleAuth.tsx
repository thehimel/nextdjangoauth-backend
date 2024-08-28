import {login, signup} from "@/store/auth/actions/auth.ts";
import {googleLoginUrl} from "@/apps/auth/utils/auth/google.ts";
import {Icon} from "@iconify/react";
import {Button, Link} from "@nextui-org/react";
import React from "react";
import { useTranslation } from "react-i18next";

interface GoogleAuthProps {
  isDisabled?: boolean;
  type: typeof signup | typeof login;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ isDisabled, type }) => {
  const { t } = useTranslation();

  return (
    <Link className="flex flex-col gap-2" href={googleLoginUrl} isDisabled={isDisabled}>
      <Button className="w-full" isDisabled={isDisabled} startContent={<Icon icon="flat-color-icons:google" width={24}/>}>
        {type === signup && t("auth.signup.withGoogle")}
        {type === login && t("auth.login.withGoogle")}
      </Button>
    </Link>
  );
};

export default GoogleAuth;
