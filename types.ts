import { translations } from './translations';

export enum Feature {
  HOME = 'HOME',
  CROP_DOCTOR = 'CROP_DOCTOR',
  MARKET_GURU = 'MARKET_GURU',
  SCHEME_NAVIGATOR = 'SCHEME_NAVIGATOR',
  WEATHER_ADVISOR = 'WEATHER_ADVISOR',
  FERTILIZER_CALCULATOR = 'FERTILIZER_CALCULATOR',
  LOAN_ADVISOR = 'LOAN_ADVISOR',
  COMMUNITY_CONNECT = 'COMMUNITY_CONNECT',
  PROFILE = 'PROFILE',
  ANALYTICS = 'ANALYTICS',
  ABOUT_US = 'ABOUT_US',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  CONTACT_US = 'CONTACT_US',
}

export interface UserProfile {
  name: string;
  location: string;
  email?: string;
}

export enum Language {
  EN = 'en',
  KN = 'kn',
}

export type TranslationKey = keyof typeof translations[Language.EN];
