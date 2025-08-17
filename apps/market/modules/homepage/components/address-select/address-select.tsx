"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { LocationIcon } from "@repo/ui/icons";
import { AddressSelect as SharedAddressSelect } from "@/components/address-select/address-select";
import { useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";

export const AddressSelect = () => {
  const t = useTranslations("profile.address");
  const { user } = useUserContext();
  return (
    <Drawer>
      <DrawerTrigger className="bg-primary/10 px-4 w-full text-primary py-2 border-y border-primary/20 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
        <LocationIcon className="size-4 min-w-4 fill-primary" />{" "}
        <span className="line-clamp-1 text-start w-fit">
          {user?.address?.address ?? t("addresses")}
        </span>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4 mt-3 space-y-4">
        <DrawerTitle className="hidden">{t("addresses")}</DrawerTitle>
        <SharedAddressSelect />
      </DrawerContent>
    </Drawer>
  );
};
