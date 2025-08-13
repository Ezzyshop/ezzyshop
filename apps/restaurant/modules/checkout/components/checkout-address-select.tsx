"use client";
import { AddressSelect } from "@/components/address-select/address-select";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { MapPinIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { useTranslations } from "next-intl";

export const CheckoutAddressSelect = () => {
  const t = useTranslations("checkout.shipping.address");
  const { user } = useUserContext();

  return (
    <div className="flex items-start gap-2 ">
      <div className="rounded-full p-2 w-fit bg-primary/20">
        <MapPinIcon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-muted-foreground">{t("address-select")}</p>
        <p className="font-medium text-left">
          {user?.address?.address || t("no-address-selected")}
        </p>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" className="w-full mt-3 text-black">
              {t("change-address")}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-3 pt-0 space-y-4">
            <DrawerTitle className="hidden">{t("change-address")}</DrawerTitle>
            <AddressSelect />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
