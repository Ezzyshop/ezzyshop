"use client";
import { useTranslations } from "next-intl";
import { Wallet, RefreshCw } from "lucide-react";
import { useCourierContext } from "@/contexts/courier.context";

export const CourierEarnings = () => {
  const t = useTranslations("courier");
  const { profile, refetch, isFetching } = useCourierContext();

  if (!profile) return null;

  return (
    <button
      type="button"
      onClick={() => refetch()}
      disabled={isFetching}
      className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 active:scale-95 transition-transform"
    >
      <Wallet className="size-4 text-primary" />
      <div className="leading-tight text-right">
        <p className="text-[10px] text-muted-foreground">{t("balance")}</p>
        <p className="text-sm font-bold text-primary">
          {profile.total_earnings.toLocaleString()} {profile.currency_symbol}
        </p>
      </div>
      <RefreshCw
        className={`size-4 text-primary ${isFetching ? "animate-spin" : ""}`}
      />
    </button>
  );
};
