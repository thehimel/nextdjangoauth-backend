import "i18next";
import { resources } from "@/apps/base/@types/resources.d.ts";

export type TDefaultNS = "base" | "auth" | "profile";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: TDefaultNS;
    resources: resources; // This should match your resources type
  }
}
