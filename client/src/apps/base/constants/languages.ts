export const supportedLanguage = ['en', 'de'] as const;
export type LanguageCode = (typeof supportedLanguage)[number];

export const languages: Record<LanguageCode, string> = {
  en: 'English',
  de: 'Deutsche',
};
