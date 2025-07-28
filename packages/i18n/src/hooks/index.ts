export { useTranslations, useLocale, useFormatter } from "next-intl";
import { useRouter, usePathname } from "next/navigation.js";
import { useLocale } from "next-intl";
import { type Locale } from "../types/index.js";
import { routing } from "@repo/i18n/routing";

export function useI18nRouter() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const push = (href: string, options?: { locale?: Locale }) => {
    const targetLocale = options?.locale || locale;
    const localizedHref = `/${targetLocale}${href.startsWith("/") ? href : `/${href}`}`;
    router.push(localizedHref);
  };

  const replace = (href: string, options?: { locale?: Locale }) => {
    const targetLocale = options?.locale || locale;
    const localizedHref = `/${targetLocale}${href.startsWith("/") ? href : `/${href}`}`;
    router.replace(localizedHref);
  };

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return {
    push,
    replace,
    switchLocale,
    locale,
    pathname: pathname.replace(`/${locale}`, "") || "/",
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  };
}

export function useClientLocale() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const locales = routing.locales;

  const switchLocale = (newLocale: Locale) => {
    router.push(`/${newLocale}${pathname.replace(`/${locale}`, "") || "/"}`);
  };

  return {
    locales,
    locale,
    isRTL: false,
    switchLocale,
  };
}
