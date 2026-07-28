"use client";
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { SwipeConfirmDrawer } from "./swipe-confirm-drawer";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCash: boolean;
  amount: number;
  currencySymbol: string;
  onConfirm: () => void;
  isConfirming: boolean;
}

export const AcceptDrawer = ({
  open,
  onOpenChange,
  isCash,
  amount,
  currencySymbol,
  onConfirm,
  isConfirming,
}: IProps) => {
  const t = useTranslations("courier");

  return (
    <SwipeConfirmDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("accept_drawer.title")}
      description={
        isCash
          ? t("cash.description", {
              amount: `${amount.toLocaleString()} ${currencySymbol}`,
            })
          : t("accept_drawer.description")
      }
      swipeLabel={t("accept_drawer.swipe")}
      onConfirm={onConfirm}
      isConfirming={isConfirming}
    >
      {isCash && (
        <div className="mx-4 mb-2 flex items-center gap-3 rounded-xl bg-orange-50 p-3 text-orange-700">
          <Wallet className="size-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">
              {amount.toLocaleString()} {currencySymbol}
            </p>
            <p className="text-xs">{t("accept_drawer.cash_hint")}</p>
          </div>
        </div>
      )}
    </SwipeConfirmDrawer>
  );
};
