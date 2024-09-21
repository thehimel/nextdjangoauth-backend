import PasswordInputField, {TPasswordInputFieldRegister} from "@/apps/auth/components/auth/email/fields/PasswordInputField.tsx";
import ProfileFooter from "@/apps/auth/components/users/ProfileFooter.tsx";
import {useLogout} from "@/apps/auth/hooks/useAuth.ts";
import {TPasswordUpdateSchema, passwordUpdateSchema} from "@/apps/auth/schemas/auth.ts";
import {
  passwordUpdate,
  PasswordUpdateInterface,
  PasswordUpdateResponseInterface,
} from "@/apps/auth/store/actions/passwordUpdate.ts";
import {useAppDispatch} from "@/core/store/hooks.ts";
import {AppDispatch} from "@/core/store/store.ts";
import {getAuthToken} from "@/apps/auth/utils/auth/token.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {CardBody} from "@nextui-org/react";
import React from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

interface PasswordUpdateFormProps {
  type: "change" | "reset",
  uid?: string;
  token?: string;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({type, uid, token, setShowForm, setIsSuccess}) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();
  const logout = useLogout();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TPasswordUpdateSchema>({
    resolver: zodResolver(passwordUpdateSchema(t)),
  });

  const onSubmit = async (data: TPasswordUpdateSchema) => {
    const params: PasswordUpdateInterface = {
      access: getAuthToken() || "",
      password: data.password,
      confirmPassword: data.confirmPassword,
      uid: uid,
      token: token,
      type: type
    }

    const response: PasswordUpdateResponseInterface = await dispatch(passwordUpdate(params));

    if (!response.isTokenValid) {
      setShowForm(false);
      setIsSuccess(false);
    }

    if (response.success) {
      toast.success(t("auth.passwordReset.updateSuccess"))
      if (type === "change") {
        await logout();
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

    (Object.keys(errors) as Array<keyof TPasswordUpdateSchema>).forEach((key) => {
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
          label={t("auth.forms.labels.newPassword")}
        />
        <PasswordInputField
          register={register as TPasswordInputFieldRegister}
          errorMessage={errors["confirmPassword"]?.message}
          isSubmitting={isSubmitting}
          type={"confirmPassword"}
          label={t("auth.forms.labels.confirmNewPassword")}
        />
      </CardBody>
      <ProfileFooter title={t("base.forms.labels.save")} isLoading={isSubmitting} isDisabled={isSubmitting}/>
    </form>
  );
}

export default PasswordUpdateForm;
