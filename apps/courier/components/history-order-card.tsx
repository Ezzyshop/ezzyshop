"use client";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { ICourierOrderDetail } from "@repo/api/services/courier/index";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { Wallet, ChevronRight } from "lucide-react";

interface IProps {
  order: ICourierOrderDetail;
}

export const HistoryOrderCard = ({ order }: IProps) => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const date = order.updatedAt ?? order.accepted_at ?? order.createdAt;

  return (
    <Card
      className="py-4 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => router.push(`/orders/${order.shopId}/${order.orderId}`)}
    >
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{order.customer_info.name}</p>
            {date && (
              <p className="text-xs text-muted-foreground">
                {dayjs(date).format("DD.MM.YYYY HH:mm")}
              </p>
            )}
          </div>
          <ChevronRight className="size-4 text-muted-foreground mt-1" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {t("detail.total")}: {order.total_price.toLocaleString()}{" "}
            {order.currency_symbol}
          </span>

          {/* Courier's earning for this delivery — highlighted */}
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <Wallet className="size-4" />
            <span className="text-sm font-bold">
              +{order.delivery_price.toLocaleString()} {order.currency_symbol}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
