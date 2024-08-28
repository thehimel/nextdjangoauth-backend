import {GOOGLE_REDIRECT_URL} from "@/apps/auth/constants/urls.ts";
import {API_URL} from "@/apps/base/constants/global.ts";
import urlJoin from "url-join";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

// Example: http://127.0.0.1:8000/auth/google/callback/
export const GOOGLE_REDIRECT_URI: string = urlJoin(API_URL, GOOGLE_REDIRECT_URL)
