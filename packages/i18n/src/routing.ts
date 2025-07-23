import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of supported locales
  locales: ["en", "ru", "uz"],

  // Used when no locale matches
  defaultLocale: "uz",

  // The prefix for the locale in the URL
  localePrefix: {
    mode: "always",
    prefixes: {
      en: "/en",
      ru: "/ru",
      uz: "/uz",
    },
  },
});
