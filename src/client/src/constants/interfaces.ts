import {TFunction} from "i18next";
import {z} from "zod";

export type ColorType = "default" | "success" | "warning" | "danger";

export type languageType = {
  name: string;
  code: string;
}

export interface MessageInterface {
  text: string;
  color?: ColorType;
}

export interface AlertProps {
  text?: string;
  color?: "success" | "warning" | "error";
}

type TranslationFunctionType = TFunction<"translation", undefined>

export const updateProfileSchema = (t: TranslationFunctionType) =>
  z.object({
    username: z.string()
      .min(6, { message: t("errors.usernameTooShort") })
      .regex(/^[a-zA-Z0-9]+$/, { message: t("errors.usernameInvalidCharacters") }),
    firstName: z.string().min(1, { message: t("errors.invalidFirstName") }),
    lastName: z.string().min(1, { message: t("errors.invalidLastName") }),
  });

export type TUpdateProfileSchema = z.infer<ReturnType<typeof updateProfileSchema>>;

const emailSchema = (t: TranslationFunctionType) =>
  z.string().min(1, { message: t("errors.emailRequired") })
    .email(t("errors.invalidEmail"));

const passwordSchema = (t: TranslationFunctionType) =>
  z.string()
    .min(1, t("errors.passwordRequired"))
    .min(8, t("errors.passwordMinLength"));

export const loginSchema = (t: TranslationFunctionType) => z
  .object({
    email: emailSchema(t),
    password: passwordSchema(t),
  });

export type TLoginSchema = z.infer<ReturnType<typeof loginSchema>>;

export const signUpSchema = (t: TranslationFunctionType) => z
  .object({
    email: emailSchema(t),
    password: passwordSchema(t),
    confirmPassword: passwordSchema(t),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("errors.passwordMismatch"),
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;
