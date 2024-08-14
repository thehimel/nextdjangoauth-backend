import TextInputField from "@/components/user/fields/TextInputField.tsx";
import ProfileFooter from "@/components/user/ProfileFooter.tsx";
import ProfileHeader from "@/components/user/ProfileHeader.tsx";
import {TUpdateProfileSchema, updateProfileSchema} from "@/constants/interfaces.ts";
import {CHANGE_PASSWORD_URL, LOGIN_URL} from "@/constants/urls.ts";
import {EMAIL} from "@/store/auth/actions/authV2.ts";
import {
  updateProfileV2,
  UpdateProfileV2Interface,
  UpdateProfileV2ResponseInterface,
} from "@/store/auth/actions/updateProfileV2.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardBody, CardProps} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

const UpdateProfile = (props: CardProps) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname;  // Store the path to redirect to after login

  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);

  const access = useAppSelector((state) => state.auth.userData.access);
  const userData = useAppSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm<TUpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema(t)),
    defaultValues: {
      username: userData.user.username,
      firstName: userData.user.first_name,
      lastName: userData.user.last_name,
    },
  });

  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");

  const onSubmit = async (data: TUpdateProfileSchema) => {
    const params: UpdateProfileV2Interface = {
      access: access,
      firstName: data.firstName,
      lastName: data.lastName,
      ...(userData.user.username !== data.username && { username: data.username })  // Include username only if it's updated.
    }

    const response: UpdateProfileV2ResponseInterface = await dispatch(updateProfileV2(params));
    if (!response.isTokenValid) {
      navigate(LOGIN_URL, { state: { from: redirectPath } });
    }

    if (response.success) {
      toast.success(t("profile.updateSuccess"));
    } else {
      const errors = response.errors;
      if (!errors) {
        toast.error(t("errors.unexpectedError"));
        return;
      }

      (Object.keys(errors) as Array<keyof TUpdateProfileSchema>).forEach((key) => {
        if (errors[key]) {
          setError(key, {
            type: "server",
            message: errors[key] || t("errors.unexpectedError"),
          });
        }
      });
    }
  }

  return isLoggedIn ? (
    <Card className="w-full max-w-xl p-6 mt-2" {...props}>
      <ProfileHeader
        title={t("profile.accountDetails")}
        firstName={watchedFirstName}
        lastName={watchedLastName}
        email={userData.user.email}
        navigationLink={userData.provider === EMAIL ? {
          url: CHANGE_PASSWORD_URL,
          title: t("profile.changePassword"),
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
            />
          </div>
          <TextInputField
            register={register}
            errorMessage={errors["firstName"]?.message}
            isSubmitting={isSubmitting}
            type={"firstName"}
          />
          <TextInputField
            register={register}
            errorMessage={errors["lastName"]?.message}
            isSubmitting={isSubmitting}
            type={"lastName"}
          />
        </CardBody>
        <ProfileFooter title={t("forms.save")} isLoading={isSubmitting} isDisabled={isSubmitting} />
      </form>
    </Card>
  ) : null;
}

export default UpdateProfile;
