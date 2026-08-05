"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useI18nRouter } from "@repo/i18n/hooks";
import { localeConfigs } from "@repo/i18n/utils";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { Button } from "@repo/ui/components/ui/button";
import { Check, Languages } from "lucide-react";
import { CourierProfileLinkButton } from "./courier-profile-link-button";

export const CourierLanguageButton = () => {
  const t = useTranslations("courier");
  const { locale, switchLocale } = useI18nRouter();
  const current = localeConfigs.find((l) => l.code === locale);

  return (
    <Drawer>
      <DrawerTrigger className="w-full" asChild>
        <div className="w-full">
          <CourierProfileLinkButton
            icon={<Languages className="size-4 text-white" />}
            title={t("profile.language")}
            badge={current?.name}
          />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-3 px-3 py-5">
          <DrawerTitle className="text-center">
            {t("select_language")}
          </DrawerTitle>
          {localeConfigs.map((l) => {
            const isActive = l.code === locale;
            return (
              <Button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                variant={isActive ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Image
                  src={l.icon as string}
                  alt={l.code}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="flex-grow text-start text-sm font-medium">
                  {l.name}
                </span>
                {isActive && <Check className="size-4" />}
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
