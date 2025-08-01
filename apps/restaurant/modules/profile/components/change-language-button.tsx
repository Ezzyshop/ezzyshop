import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { ProfileLinkButton } from "./profile-link-button";
import { CheckIcon, SettingsIcon } from "@repo/ui/components/icons/index";
import { useTranslations } from "next-intl";
import { useI18nRouter } from "@repo/i18n/hooks";
import { Button } from "@repo/ui/components/ui/button";
import Image from "next/image";
import { localeConfigs } from "@repo/i18n/utils";

export const ChangeLanguageButton = () => {
  const t = useTranslations("profile");
  const { locale, switchLocale } = useI18nRouter();

  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <ProfileLinkButton
          icon={<SettingsIcon className="text-white" />}
          title={t("language")}
        />
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="flex flex-col gap-3 py-5 px-3">
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
                  src={l.icon}
                  alt={l.code}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-start flex-grow">
                  {l.name}
                </span>
                {isActive && <CheckIcon className="w-4 h-4" />}
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
