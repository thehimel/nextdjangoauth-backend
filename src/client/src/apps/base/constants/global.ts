import {GOOGLE_REDIRECT_URL} from "@/apps/auth/constants/urls.ts";
import urlJoin from "url-join";

export const ENVIRONMENT: string = process.env.ENVIRONMENT as string;
export const DEBUG: boolean = process.env.DEBUG === 'True';

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

export const API_URL: string = process.env.API_URL as string;

// Example: http://127.0.0.1:8000/auth/google/callback/
export const GOOGLE_REDIRECT_URI: string = urlJoin(API_URL, GOOGLE_REDIRECT_URL)
