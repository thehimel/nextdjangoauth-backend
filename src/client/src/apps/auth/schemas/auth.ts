import {TranslationFunctionType} from "@/apps/base/types/common.ts";
import {z} from "zod";


const emailSchema = (t: TranslationFunctionType) =>
  z.string().min(1, { message: t("auth.general.errors.emailRequired") })
    .email(t("auth.general.errors.invalidEmail"));

const passwordSchema = (t: TranslationFunctionType) =>
  z.string()
    .min(1, t("auth.general.errors.passwordRequired"))
    .min(8, t("auth.general.errors.passwordMinLength"));


export const loginSchema = (t: TranslationFunctionType) => z
  .object({
    email: emailSchema(t),
    password: passwordSchema(t),
  });

export type TLoginSchema = z.infer<ReturnType<typeof loginSchema>>;

export const sendAuthEmailSchema = (t: TranslationFunctionType) => z
  .object({
    email: emailSchema(t),
  });

export type TSendAuthEmailSchema = z.infer<ReturnType<typeof sendAuthEmailSchema>>;


export const signUpSchema = (t: TranslationFunctionType) => z
  .object({
    email: emailSchema(t),
    password: passwordSchema(t),
    confirmPassword: passwordSchema(t),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("auth.general.errors.passwordMismatch"),
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;


export const passwordUpdateSchema = (t: TranslationFunctionType) => z
  .object({
    password: passwordSchema(t),
    confirmPassword: passwordSchema(t),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("auth.general.errors.passwordMismatch"),
    path: ["confirmPassword"],
  });

export type TPasswordUpdateSchema = z.infer<ReturnType<typeof passwordUpdateSchema>>;
