import TextInputField from "@/apps/auth/components/users/fields/TextInputField.tsx";
import ProfileFooter from "@/apps/auth/components/users/ProfileFooter.tsx";
import ProfileHeader from "@/apps/auth/components/users/ProfileHeader.tsx";
import {PASSWORD_CHANGE_URL, LOGIN_URL} from "@/apps/auth/urls/client.ts";
import {TProfileUpdateSchema, profileUpdateSchema} from "@/apps/auth/schemas/users.ts";
import {EMAIL} from "@/apps/auth/store/actions/auth.ts";
import {
  profileUpdate,
  ProfileUpdateInterface,
  ProfileUpdateResponseInterface,
} from "@/apps/auth/store/actions/profileUpdate.ts";
import {useAppDispatch, useAppSelector} from "@/core/store/hooks.ts";
import {AppDispatch} from "@/core/store/store.ts";
import {getAuthToken} from "@/apps/auth/utils/auth/token.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardBody, CardProps} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

const ProfileUpdate = (props: CardProps) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);

  const access = getAuthToken() || "";
  const userData = useAppSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm<TProfileUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema(t)),
    defaultValues: {
      username: userData.user.username,
      firstName: userData.user.first_name,
      lastName: userData.user.last_name,
    },
  });

  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");

  const onSubmit = async (data: TProfileUpdateSchema) => {
    const params: ProfileUpdateInterface = {
      access: access,
      firstName: data.firstName,
      lastName: data.lastName,
      ...(userData.user.username !== data.username && { username: data.username })  // Include username only if it's updated.
    }

    const response: ProfileUpdateResponseInterface = await dispatch(profileUpdate(params));
    if (!response.isTokenValid) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }

    if (response.success) {
      toast.success(t("profile.messages.updateSuccess"));
      return;
    }

    const errors = response.errors;
    if (!errors) {
      toast.error(t("base.errors.unexpectedError"));
      return;
    }

    (Object.keys(errors) as Array<keyof TProfileUpdateSchema>).forEach((key) => {
      if (errors[key]) {
        setError(key, {
          type: "server",
          message: errors[key] || t("base.errors.unexpectedError"),
        });
      }
    });
  }

  return isLoggedIn ? (
    <Card className="w-full max-w-xl p-6 mt-2" {...props}>
      <ProfileHeader
        title={t("profile.labels.accountDetails")}
        firstName={watchedFirstName}
        lastName={watchedLastName}
        email={userData.user.email}
        navigationLink={userData.provider === EMAIL ? {
          url: PASSWORD_CHANGE_URL,
          title: t("profile.labels.changePassword"),
        } : undefined}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-1 md:col-span-2">
            <TextInputField
              register={register}
              errorMessage={errors["username"]?.message}
              isSubmitting={isSubmitting}
              type={"username"}
              autoComplete={"username"}
            />
          </div>
          <TextInputField
            register={register}
            errorMessage={errors["firstName"]?.message}
            isSubmitting={isSubmitting}
            type={"firstName"}
            autoComplete={"name"}
          />
          <TextInputField
            register={register}
            errorMessage={errors["lastName"]?.message}
            isSubmitting={isSubmitting}
            type={"lastName"}
            autoComplete={"family-name"}
          />
        </CardBody>
        <ProfileFooter title={t("base.forms.labels.save")} isLoading={isSubmitting} isDisabled={isSubmitting} />
      </form>
    </Card>
  ) : null;
}

export default ProfileUpdate;
