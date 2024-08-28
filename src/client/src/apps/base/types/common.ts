import {TFunction} from "i18next";

export type TranslationFunctionType = TFunction<"translation", undefined>

export type TColor = "default" | "success" | "warning" | "danger";

export interface MessageInterface {
  text: string;
  color?: TColor;
}
