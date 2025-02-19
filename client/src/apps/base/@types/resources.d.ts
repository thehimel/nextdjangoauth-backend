import auth from '../../../../public/static/locales/en/auth.json';
import base from '../../../../public/static/locales/en/base.json';
import profile from '../../../../public/static/locales/en/profile.json';

type AuthTranslation = typeof auth;
type BaseTranslation = typeof base;
type ProfileTranslation = typeof profile;

export interface Resources {
  auth: AuthTranslation;
  base: BaseTranslation;
  profile: ProfileTranslation;
}

export type resources = Resources;
