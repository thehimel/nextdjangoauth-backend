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
