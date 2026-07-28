"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@repo/ui/components/ui/drawer";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  currencySymbol: string;
  onConfirm: () => void;
  isConfirming: boolean;
}

export const CashConfirmationDrawer = ({
  open,
  onOpenChange,
  amount,
  currencySymbol,
  onConfirm,
  isConfirming,
}: IProps) => {
  const t = useTranslations("courier");

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("cash.title")}</DrawerTitle>
          <DrawerDescription>
            {t("cash.description", {
              amount: `${amount.toLocaleString()} ${currencySymbol}`,
            })}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button size="xl" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? t("cash.confirming") : t("cash.confirm")}
          </Button>
          <Button
            size="xl"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            {t("cash.cancel")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
