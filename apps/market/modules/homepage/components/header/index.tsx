"use client";
import { useShopContext } from "@/contexts/shop.context";
import { useI18nRouter } from "@repo/i18n/hooks";
import { ChevronDown } from "@repo/ui/components/icons/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import Image from "next/image";

export const Header = () => {
  const { locale, locales, switchLocale } = useI18nRouter();
  const { logo } = useShopContext();

  const localeIcons = {
    uz: "/images/uzb.png",
    ru: "/images/ru.png",
    en: "/images/en.png",
  };

  return (
    <div className="px-4 flex items-center justify-between mt-4">
      <Image
        src={logo ?? "/icons/logo.svg"}
        alt="logo"
        width={64}
        height={64}
        className="rounded-xl object-cover"
        priority
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 bg-secondary px-2 py-1 rounded-md cursor-pointer">
          <Image
            src={localeIcons[locale]}
            alt={locale}
            width={20}
            height={20}
          />
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchLocale(locale)}
              className="flex items-center gap-2"
            >
              <Image
                src={localeIcons[locale]}
                alt={locale}
                width={20}
                height={20}
              />
              <span className="uppercase">{locale}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
