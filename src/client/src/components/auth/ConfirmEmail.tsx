"use client";

import Auth from "@/components/auth/Auth.tsx";
import {verifyEmail} from "@/store/auth/authActions.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import React, {useEffect} from "react";
import {Spinner} from "@nextui-org/react";
import {useParams} from "react-router-dom";
import {toast} from "sonner";


const ConfirmEmail = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { key } = useParams();

  const [isEmailVerificationLoading, setIsEmailVerificationLoading] = React.useState(false);
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (key) {
        const response = await dispatch(verifyEmail({ key }));
        if (response) {
          setIsEmailVerified(true);
          toast.success("Email verified successfully.")
        } else {
          console.log("failed");
        }
      }
    };
    setIsEmailVerificationLoading(true);
    verifyUserEmail().then(() => {
      setIsEmailVerificationLoading(false);
    })
  }, [key, dispatch]);

  return (
      <>
        {isEmailVerificationLoading ? (
          <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
            <p className="text-center">Verifying email. <Spinner size="sm" color="default"/></p>
          </div>
        ) : null}
        {!isEmailVerificationLoading && isEmailVerified ? (
          <Auth pageType="login" headline="Thanks for confirming your email. Log in to your account to continue."/>
        ) : null}
        {!isEmailVerificationLoading && !isEmailVerified ? (
          <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
            <p className="text-danger">Email verification failed. However, you can resend the confirmation email.</p>
          </div>
        ) : null}
      </>
  );
}

export default ConfirmEmail;
