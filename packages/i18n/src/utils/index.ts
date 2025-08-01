import { type Locale, type LocaleConfig } from "@repo/i18n/types";

export const localeConfigs: LocaleConfig[] = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    icon: "/images/en.png",
  },
  {
    code: "ru",
    name: "Русский",
    flag: "🇷🇺",
    icon: "/images/ru.png",
  },
  {
    code: "uz",
    name: "O'zbekcha",
    flag: "🇺🇿",
    icon: "/images/uz.png",
  },
];

export function getLocaleConfig(locale: Locale): LocaleConfig | undefined {
  return localeConfigs.find((config) => config.code === locale);
}

export function isValidLocale(locale: string): locale is Locale {
  return localeConfigs.some((config) => config.code === locale);
}

export function getLocaleName(locale: Locale): string {
  const config = getLocaleConfig(locale);
  return config?.name || locale;
}

export function getLocaleFlag(locale: Locale): string {
  const config = getLocaleConfig(locale);
  return config?.flag || "🌐";
}

export function formatLocaleForDisplay(
  locale: Locale,
  options?: {
    showFlag?: boolean;
    showName?: boolean;
  }
): string {
  const { showFlag = true, showName = true } = options || {};
  const config = getLocaleConfig(locale);

  if (!config) return locale;

  let display = "";
  if (showFlag) display += config.flag;
  if (showFlag && showName) display += " ";
  if (showName) display += config.name;

  return display || locale;
}
