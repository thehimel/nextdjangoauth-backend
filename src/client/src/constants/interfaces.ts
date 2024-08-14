import {TFunction} from "i18next";

export type TranslationFunctionType = TFunction<"translation", undefined>

export type ColorType = "default" | "success" | "warning" | "danger";

export interface MessageInterface {
  text: string;
  color?: ColorType;
}

export type languageType = {
  name: string;
  code: string;
}

export interface AlertProps {
  text?: string;
  color?: "success" | "warning" | "error";
}
