import {googleLoginUrl} from "@/utils/oauth.ts";
import {Icon} from "@iconify/react";
import {Button, Divider, Link} from "@nextui-org/react";
import React from "react";
import { useTranslation } from "react-i18next";

interface GoogleAuthProps {
  isDisabled: boolean;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ isDisabled }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-4">
        <Divider className="flex-1"/>
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Divider className="flex-1"/>
      </div>
      <Link className="flex flex-col gap-2" href={googleLoginUrl} isDisabled={isDisabled}>
        <Button className="w-full" isDisabled={isDisabled} startContent={<Icon icon="flat-color-icons:google" width={24}/>}>
          {t("auth.login.continueWithGoogle")}
        </Button>
      </Link>
    </>
  );
};

export default GoogleAuth;
