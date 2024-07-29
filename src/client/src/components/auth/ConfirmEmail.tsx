"use client";

import Auth from "@/components/auth/Auth.tsx";
import SendAuthEmail from "@/components/auth/SendAuthEmail.tsx";
import {verifyEmail} from "@/store/auth/actions/verifyEmail.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import React, {useEffect} from "react";
import {Spinner} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import {toast} from "sonner";


const ConfirmEmail = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { key } = useParams();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (key) {
        const response = await dispatch(verifyEmail({ key }));
        if (response) {
          setIsEmailVerified(true);
          toast.success("Email verified successfully.")
        }
      }
    };
    setIsLoading(true);
    verifyUserEmail().then(() => {
      setIsLoading(false);
    })
  }, [key, dispatch]);

  return (
    <>
      {isLoading && (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <span className="text-center">Verifying email. <Spinner size="sm" color="default"/></span>
        </div>
      )}
      {!isLoading && isEmailVerified && (
        <Auth pageType={"login"} headline={"Email verified. Log in to your account to continue."}/>
      )}
      {!isLoading && !isEmailVerified && (<SendAuthEmail requestType={"resend_email_verification"}/>)}
    </>
  );
}

export default ConfirmEmail;
