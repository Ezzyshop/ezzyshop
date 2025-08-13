"use client";

import { ChevronRightIcon, UserIcon } from "@repo/ui/components/icons/index";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { useTranslations } from "next-intl";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";

export const CheckoutUserInfo = () => {
  const t = useTranslations("checkout.user");
  return (
    <Drawer>
      <DrawerTrigger className="flex items-center gap-2 w-full">
        <div className="flex items-start gap-2 flex-grow">
          <div className="rounded-full p-2 bg-primary/20">
            <UserIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground text-left">
              {t("title")}
            </p>
            <p className="font-medium text-left leading-5">Ulugbek Asadov</p>
            <p className="text-sm text-muted-foreground text-left">
              +998 99 123 45 67
            </p>
          </div>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
      </DrawerTrigger>
      <DrawerContent className="p-3 pt-0">
        <DrawerTitle>{t("title")}</DrawerTitle>
        <DrawerDescription>{t("description")}</DrawerDescription>
        <div className="flex flex-col gap-2 mt-2">
          <Label>{t("name")}</Label>
          <Input placeholder={t("enter_name")} />
          <Label>{t("phone")}</Label>
          <Input placeholder={t("enter_phone")} />
          <Button>{t("save")}</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
