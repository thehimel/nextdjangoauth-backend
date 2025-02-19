import {TranslationFunctionType} from "@/apps/base/types/common.ts";
import {z} from "zod";

export const profileUpdateSchema = (t: TranslationFunctionType) =>
  z.object({
    username: z.string()
      .min(6, { message: t("profile.errors.usernameTooShort") })
      .regex(/^[a-zA-Z0-9]+$/, { message: t("profile.errors.usernameInvalidCharacters") }),
    firstName: z.string().min(1, { message: t("profile.errors.invalidFirstName") }),
    lastName: z.string().min(1, { message: t("profile.errors.invalidLastName") }),
  });

export type TProfileUpdateSchema = z.infer<ReturnType<typeof profileUpdateSchema>>;
