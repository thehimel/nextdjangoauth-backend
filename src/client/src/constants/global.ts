import {PROD} from "@/constants/words.ts";

export const ENVIRONMENT: string = import.meta.env.ENVIRONMENT || PROD;
export const DEBUG: boolean = ENVIRONMENT !== PROD;
