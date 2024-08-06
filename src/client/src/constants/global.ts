import {PROD} from "@/constants/words.ts";

export const ENVIRONMENT: string = import.meta.env.VITE_ENVIRONMENT || PROD;
export const DEBUG: boolean = ENVIRONMENT !== PROD;

export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
export const GOOGLE_REDIRECT_URI: string = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://127.0.0.1:8000/auth/google/callback/'
