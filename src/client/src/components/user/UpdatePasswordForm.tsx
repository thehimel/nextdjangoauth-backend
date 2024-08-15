import PasswordInputField, {TPasswordInputFieldRegister} from "@/components/auth/email/fields/PasswordInputField.tsx";
import ProfileFooter from "@/components/user/ProfileFooter.tsx";
import {TUpdatePasswordSchema, updatePasswordSchema} from "@/schemas/auth.ts";
import {
  updatePassword,
  UpdatePasswordInterface,
  UpdatePasswordResponseInterface,
} from "@/store/auth/actions/updatePassword.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {handleLogout} from "@/utils/logout.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {CardBody} from "@nextui-org/react";
import React from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

interface UpdatePasswordV2Props {
  type: "change" | "reset",
  uid?: string;
  token?: string;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePasswordForm: React.FC<UpdatePasswordV2Props> = ({type, uid, token, setShowForm, setIsSuccess}) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();

  const userData = useAppSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema(t)),
  });

  const onSubmit = async (data: TUpdatePasswordSchema) => {
    const params: UpdatePasswordInterface = {
      access: userData.access,
      password: data.password,
      confirmPassword: data.confirmPassword,
      uid: uid,
      token: token,
      type: type
    }

    const response: UpdatePasswordResponseInterface = await dispatch(updatePassword(params));

    if (!response.isTokenValid) {
      setShowForm(false);
      setIsSuccess(false);
    }

    if (response.success) {
      toast.success(t("auth.passwordReset.updateSuccess"))
      if (type === "change") {
        await handleLogout(dispatch);
      } else {
        setIsSuccess(true);
      }
      return;
    }

    const errors = response.errors;
    if (!errors) {
      toast.error(t("errors.unexpectedError"));
      return;
    }

    (Object.keys(errors) as Array<keyof TUpdatePasswordSchema>).forEach((key) => {
      if (errors[key]) {
        setError(key, {
          type: "server",
          message: errors[key] || t("errors.unexpectedError"),
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardBody className="grid grid-cols-1 gap-4">
        <PasswordInputField
          register={register as TPasswordInputFieldRegister}
          errorMessage={errors["password"]?.message}
          isSubmitting={isSubmitting}
          type={"password"}
          label={t("forms.newPassword")}
        />
        <PasswordInputField
          register={register as TPasswordInputFieldRegister}
          errorMessage={errors["confirmPassword"]?.message}
          isSubmitting={isSubmitting}
          type={"confirmPassword"}
          label={t("forms.confirmNewPassword")}
        />
      </CardBody>
      <ProfileFooter title={t("forms.save")} isLoading={isSubmitting} isDisabled={isSubmitting}/>
    </form>
  );
}

export default UpdatePasswordForm;
