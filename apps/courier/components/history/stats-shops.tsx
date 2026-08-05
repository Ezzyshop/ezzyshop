"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Store } from "lucide-react";
import { ICourierShopStat } from "@repo/api/services/courier/index";
import { formatDuration } from "@/utils/format";

interface IProps {
  shops: ICourierShopStat[];
  currency: string;
}

export const StatsShops = ({ shops, currency }: IProps) => {
  const t = useTranslations("courier");

  const units = {
    sec: t("stats.sec"),
    min: t("stats.min"),
    hour: t("stats.hour"),
    day: t("stats.day"),
  };

  return (
    <Card className="py-3">
      <CardContent className="space-y-3 px-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Store className="size-4" />
          {t("stats.shops_title")}
        </div>

        {shops.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t("stats.shops_empty")}
          </p>
        ) : (
          shops.map((shop) => {
            const avgDelivery = formatDuration(shop.avg_delivery_seconds, units);
            return (
              <div key={shop.shop_id} className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {shop.shop_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {shop.orders} {t("stats.orders_short")}
                      {avgDelivery ? ` · ${avgDelivery}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      {shop.earnings.toLocaleString()} {currency}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {shop.share_pct}%
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${shop.share_pct}%` }}
                  />
                </div>

                {(shop.debt_balance > 0 || shop.late_count > 0) && (
                  <div className="flex flex-wrap gap-1.5">
                    {shop.debt_balance > 0 && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                        {t("stats.debt_total")}:{" "}
                        {shop.debt_balance.toLocaleString()} {currency}
                      </span>
                    )}
                    {shop.late_count > 0 && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                        {t("stats.late")}: {shop.late_count}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
