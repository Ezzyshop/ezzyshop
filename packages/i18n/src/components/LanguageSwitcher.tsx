"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useI18nRouter } from "@repo/i18n/hooks";
import { localeConfigs, formatLocaleForDisplay } from "@repo/i18n/utils";
import { type LanguageSwitcherProps, type Locale } from "@repo/i18n/types";

export function LanguageSwitcher({
  className = "",
  showFlag = true,
  showName = true,
  variant = "dropdown",
}: LanguageSwitcherProps) {
  const t = useTranslations("language");
  const { locale, switchLocale } = useI18nRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale !== locale) {
      switchLocale(newLocale);
    }
  };

  if (variant === "buttons") {
    return (
      <div className={`flex gap-2 ${className}`}>
        {localeConfigs.map((config) => (
          <button
            key={config.code}
            onClick={() => handleLocaleChange(config.code)}
            className={`px-3 py-2 rounded border transition-colors ${
              locale === config.code
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title={config.name}
          >
            {formatLocaleForDisplay(config.code, { showFlag, showName })}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label={t("selectLanguage")}
      >
        {localeConfigs.map((config) => (
          <option key={config.code} value={config.code}>
            {formatLocaleForDisplay(config.code, { showFlag, showName })}
          </option>
        ))}
      </select>
    </div>
  );
}

export function LanguageDropdown({
  className = "",
  showFlag = true,
  showName = true,
}: Omit<LanguageSwitcherProps, "variant">) {
  const t = useTranslations("language");
  const { locale, switchLocale } = useI18nRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLocaleConfig = localeConfigs.find(
    (config) => config.code === locale
  );

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label={t("switchLanguage")}
        aria-expanded={isOpen}
      >
        {currentLocaleConfig &&
          formatLocaleForDisplay(currentLocaleConfig.code, {
            showFlag,
            showName,
          })}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {localeConfigs.map((config) => (
            <button
              key={config.code}
              onClick={() => {
                handleLocaleChange(config.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                locale === config.code
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              {formatLocaleForDisplay(config.code, { showFlag, showName })}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  function handleLocaleChange(newLocale: Locale) {
    if (newLocale !== locale) {
      switchLocale(newLocale);
    }
  }
}
