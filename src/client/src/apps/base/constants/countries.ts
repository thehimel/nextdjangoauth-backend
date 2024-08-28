import {LanguageCode} from "@/apps/base/constants/languages.ts";

export const countryCodes: Record<LanguageCode, string> = {
  en: 'gb',
  de: 'de',
}

export const countryFlag = (languageCode: LanguageCode): string => {
  const countryCode = countryCodes[languageCode];
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
};
