import {DEBUG} from "@/apps/base/constants/global.ts";
import {supportedLanguage} from "@/apps/base/constants/languages.ts";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    ns: ['base', 'auth', 'profile'],
    fallbackNS: ['base', 'auth', 'profile'],  // Use this to load all namespaces automatically
    supportedLngs: supportedLanguage,
    debug: DEBUG,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],  // Order of language detection
      caches: ['localStorage', 'cookie']  // Cache the detected language
    },
    backend: {
      loadPath: '/static/locales/{{lng}}/{{ns}}.json',  // Path to translation files
    },
    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },
  });


export default i18n;
