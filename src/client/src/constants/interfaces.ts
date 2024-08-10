import {TFunction} from "i18next";
import {z} from "zod";

export type ColorType = "default" | "success" | "warning" | "danger";

export type languageType = {
  name: string;
  code: string;
}

export interface MessageInterface {
  text: string;
  color: ColorType;
}

export interface AlertProps {
  text?: string;
  color?: "success" | "warning" | "error";
}


type TranslationFunctionType = TFunction<"translation", undefined>

export const signUpSchema = (t: TranslationFunctionType ) => z
  .object({
    email: z.string().min(1, { message: t("errors.emailRequired") })
      .email(t("errors.invalidEmail")),
    password: z.string()
      .min(1, t("errors.passwordRequired"))
      .min(8, t("errors.passwordMinLength")),
    confirmPassword: z.string()
      .min(1, t("errors.confirmPasswordRequired"))
      .min(8, t("errors.passwordMinLength")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("errors.passwordMismatch"),
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;
