"use client";
import { useEffect } from "react";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Loader2, History } from "lucide-react";
import { CourierService } from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";
import { HistoryOrderCard } from "./history-order-card";
import { CourierEarnings } from "./courier-earnings";

export const OrderHistory = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { isLoading: isProfileLoading, isCourier } = useCourierContext();

  useEffect(() => {
    if (!isProfileLoading && !isCourier) {
      router.replace("/login");
    }
  }, [isProfileLoading, isCourier, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["courier-history"],
    queryFn: () => CourierService.getHistory(),
    enabled: isCourier,
  });

  const orders = data?.data ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between gap-2">
        <p className="font-semibold">{t("dock.history")}</p>
        <CourierEarnings />
      </header>

      <div className="flex-1 space-y-3 p-4">
        {isLoading || isProfileLoading ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-16 text-center text-muted-foreground">
            <History className="size-10" />
            <p>{t("history_empty")}</p>
          </div>
        ) : (
          orders.map((order) => (
            <HistoryOrderCard key={order.orderId} order={order} />
          ))
        )}
      </div>
    </div>
  );
};
