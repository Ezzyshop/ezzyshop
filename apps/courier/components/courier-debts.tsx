"use client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CourierService } from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";
import { Wallet } from "lucide-react";

export const CourierDebts = () => {
  const t = useTranslations("courier");
  const { isCourier } = useCourierContext();

  const { data, isLoading } = useQuery({
    queryKey: ["courier-own-debts"],
    queryFn: () => CourierService.getDebts(),
    enabled: isCourier,
  });

  const debtsData = data?.data;
  const debts = debtsData?.debts ?? [];
  const totalBalance = debtsData?.total_balance ?? 0;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="text-xl font-bold">{t("debts.title")}</h1>

      {!isLoading && debts.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <Wallet className="size-10 opacity-40" />
          <p className="text-sm">{t("debts.empty")}</p>
        </div>
      )}

      {totalBalance > 0 && (
        <div className="rounded-xl border bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">{t("debts.total")}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {totalBalance.toLocaleString()} {t("debts.currency")}
          </p>
        </div>
      )}

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl border bg-muted animate-pulse"
            />
          ))
        : debts.map((debt) => (
            <div
              key={debt.shop_id}
              className="rounded-xl border p-4 flex justify-between items-center"
            >
              <p className="font-semibold text-sm">{debt.shop_name}</p>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-500">
                  {debt.balance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("debts.currency")}
                </p>
              </div>
            </div>
          ))}
    </div>
  );
};
