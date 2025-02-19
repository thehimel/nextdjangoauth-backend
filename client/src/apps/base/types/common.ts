import {TDefaultNS} from "@/apps/base/@types/i18next";
import {TFunction} from "i18next";

export type TranslationFunctionType = TFunction<TDefaultNS, undefined>

export type TColor = "default" | "success" | "warning" | "danger";

export interface MessageInterface {
  text: string;
  color?: TColor;
}
