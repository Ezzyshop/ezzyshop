"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { LocationEdit } from "@repo/ui/icons";
import { AddressSelect as SharedAddressSelect } from "@/components/address-select/address-select";
import { useTranslations } from "next-intl";

export const AddressSelect = () => {
  const t = useTranslations("profile.address");
  return (
    <Drawer>
      <DrawerTrigger className="bg-primary/10  w-full text-primary py-2 border-y border-primary/20 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
        <LocationEdit className="w-4 h-4" /> <span>{t("addresses")}</span>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4 mt-3 space-y-4">
        <DrawerTitle className="hidden">{t("addresses")}</DrawerTitle>
        <SharedAddressSelect />
      </DrawerContent>
    </Drawer>
  );
};
