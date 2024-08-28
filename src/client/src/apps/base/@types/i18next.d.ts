import "i18next";
import { resources } from "@/apps/base/@types/resources.d.ts";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: resources; // This should match your resources type
  }
}
