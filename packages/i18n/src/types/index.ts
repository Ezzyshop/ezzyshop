export type Locale = "en" | "ru" | "uz";

export interface LocaleIconAsset {
  src: string;
}

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  rtl?: boolean;
  icon: string | LocaleIconAsset;
}

export interface TranslationKeys {
  [key: string]: any;
}

export interface LanguageSwitcherProps {
  className?: string;
  showFlag?: boolean;
  showName?: boolean;
  variant?: "dropdown" | "buttons";
}
