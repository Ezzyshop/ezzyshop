"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { SwipeConfirmDrawer } from "./swipe-confirm-drawer";

const ETA_OPTIONS = [10, 15, 20] as const;
type EtaMinutes = (typeof ETA_OPTIONS)[number];

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCash: boolean;
  amount: number;
  currencySymbol: string;
  onConfirm: (etaMinutes: EtaMinutes) => void;
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
  const [eta, setEta] = useState<EtaMinutes | null>(null);
  const [shaking, setShaking] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset ETA when drawer closes
  useEffect(() => {
    if (!open) setEta(null);
  }, [open]);

  const handleSwipeComplete = () => {
    if (!eta) {
      // Trigger shake and reset swipe
      setShaking(true);
      setResetToken((v) => v + 1);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
      shakeTimer.current = setTimeout(() => setShaking(false), 500);
      return;
    }
    onConfirm(eta);
  };

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
      onConfirm={handleSwipeComplete}
      isConfirming={isConfirming}
      externalResetToken={resetToken}
    >
      {/* ETA selection */}
      <div className="mx-4 mb-3 space-y-2">
        <p className="text-sm font-medium text-center">
          {t("accept_drawer.eta_label")}
        </p>
        <div className={`flex gap-2 ${shaking ? "animate-shake" : ""}`}>
          {ETA_OPTIONS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setEta(min)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${
                eta === min
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-transparent"
              }`}
            >
              {min} {t("accept_drawer.eta_min")}
            </button>
          ))}
        </div>
        {!eta && shaking && (
          <p className="text-xs text-destructive text-center">
            {t("accept_drawer.eta_required")}
          </p>
        )}
      </div>

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
