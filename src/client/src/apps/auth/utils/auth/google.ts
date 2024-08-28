import {GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI} from "@/constants/global.ts";

export const getGoogleLoginUrl = (callbackUrl: string, clientId: string): string => {
  return `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(callbackUrl)}&prompt=consent&response_type=token&client_id=${clientId}&scope=openid%20email%20profile`;
};

export const googleLoginUrl: string = getGoogleLoginUrl(GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_ID);
