import {TFunction} from "i18next";

export type TranslationFunctionType = TFunction<"translation", undefined>

export type ColorType = "default" | "success" | "warning" | "danger";

export interface MessageInterface {
  text: string;
  color?: ColorType;
}
