"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import {
  CourierService,
  CourierOrderStatus,
  ICourierOrderDetail,
} from "@repo/api/services/courier/index";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { MapPin, Phone, ChevronRight, PackageCheck, Bike } from "lucide-react";
import { MapDrawer } from "./map-drawer";
import { SwipeConfirmDrawer } from "./swipe-confirm-drawer";

interface IProps {
  order: ICourierOrderDetail;
}

export const ActiveOrderCard = ({ order }: IProps) => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const queryClient = useQueryClient();
  const [mapOpen, setMapOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Next status the courier can move the order to
  const nextStatus =
    order.status === CourierOrderStatus.Processing
      ? CourierOrderStatus.Delivering
      : order.status === CourierOrderStatus.Delivering
        ? CourierOrderStatus.Completed
        : null;

  const { mutate: advance, isPending } = useMutation({
    mutationFn: (status: string) =>
      CourierService.updateOrderStatus(order.shopId, order.orderId, status),
    onSuccess: () => {
      toast.success(t("status_updated"));
      setStatusOpen(false);
      queryClient.invalidateQueries({ queryKey: ["courier-active-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["courier-order", order.shopId, order.orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["courier-me"] });
      queryClient.invalidateQueries({ queryKey: ["courier-history"] });
    },
    onError: () => toast.error(t("status_update_error")),
  });

  const actionLabel =
    order.status === CourierOrderStatus.Processing
      ? t("action.picked_up")
      : t("action.delivered");
  const ActionIcon =
    order.status === CourierOrderStatus.Processing ? Bike : PackageCheck;

  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold">{order.customer_info.name}</div>
          <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
            {t(`status.${order.status}`)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <a
            href={`tel:${order.customer_info.phone}`}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <Phone className="size-4 shrink-0" />
            {order.customer_info.phone}
          </a>
          <span className="text-primary font-bold whitespace-nowrap">
            {order.total_price.toLocaleString()} {order.currency_symbol}
          </span>
        </div>

        {order.delivery_address?.address && (
          <div className="text-sm text-muted-foreground flex items-start gap-2">
            <MapPin className="size-4 shrink-0 mt-0.5" />
            <span>{order.delivery_address.address}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {order.delivery_address && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setMapOpen(true)}
            >
              <MapPin className="size-4" />
              {t("open_map")}
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              router.push(`/orders/${order.shopId}/${order.orderId}`)
            }
          >
            {t("details")}
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {nextStatus && (
          <Button
            className="w-full"
            size="xl"
            disabled={isPending}
            onClick={() => setStatusOpen(true)}
          >
            <ActionIcon className="size-5" />
            {actionLabel}
          </Button>
        )}
      </CardContent>

      {nextStatus && (
        <SwipeConfirmDrawer
          open={statusOpen}
          onOpenChange={setStatusOpen}
          title={actionLabel}
          description={t("action.confirm_hint")}
          swipeLabel={t("action.swipe")}
          isConfirming={isPending}
          onConfirm={() => advance(nextStatus)}
        />
      )}

      {order.delivery_address && (
        <MapDrawer
          open={mapOpen}
          onOpenChange={setMapOpen}
          lat={order.delivery_address.lat}
          lng={order.delivery_address.lng}
        />
      )}
    </Card>
  );
};
