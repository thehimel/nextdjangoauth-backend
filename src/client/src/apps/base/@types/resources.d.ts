import translation from '../../../../public/static/locales/en/translation.json';

type Translation = typeof translation;

export interface Resources {
  translation: Translation;
}

export type resources = Resources;
