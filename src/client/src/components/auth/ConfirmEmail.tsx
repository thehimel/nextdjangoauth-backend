"use client";

import AuthHeader from "@/components/auth/AuthHeader.tsx";
import EmailLogin from "@/components/auth/EmailLogin.tsx";
import SendAuthEmail from "@/components/auth/SendAuthEmail.tsx";
import {verifyEmail} from "@/store/auth/actions/verifyEmail.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import React, {useEffect} from "react";
import {Spinner} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {toast} from "sonner";


const ConfirmEmail = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { key } = useParams();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (key) {
        const response = await dispatch(verifyEmail({ key }));
        if (response) {
          setIsEmailVerified(true);
          toast.success(t("auth.emailVerification.success"))
        }
      }
    };
    setIsLoading(true);
    verifyUserEmail().then(() => {
      setIsLoading(false);
    })
  }, [key, dispatch, t]);

  return (
    <>
      {isLoading && (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <span className="text-center">{t("auth.emailVerification.verifyingEmail")}&nbsp;<Spinner size="sm" color="default"/></span>
        </div>
      )}
      {!isLoading && isEmailVerified && (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <AuthHeader title={t("common.welcome")} message={{text: t("auth.emailVerification.successLogin")}}/>
          <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
            <EmailLogin isEmailLoginSelected/>
          </div>
        </div>
      )}
      {!isLoading && !isEmailVerified && (<SendAuthEmail requestType={"resend_email_verification"}/>)}
    </>
  );
}

export default ConfirmEmail;
