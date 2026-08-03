"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import {
  CourierService,
  CourierOrderStatus,
  ICourierOrderDetail,
  ICourierPenalty,
} from "@repo/api/services/courier/index";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { MapPin, Phone, ChevronRight, PackageCheck, Bike, Store, Clock, ShieldAlert } from "lucide-react";
import { MapDrawer } from "./map-drawer";
import { SwipeConfirmDrawer } from "./swipe-confirm-drawer";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";

interface IProps {
  order: ICourierOrderDetail;
}

export const ActiveOrderCard = ({ order }: IProps) => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const queryClient = useQueryClient();
  const [mapOpen, setMapOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [penaltyAlert, setPenaltyAlert] = useState<ICourierPenalty | null>(null);

  const remaining = useCountdown(
    order.status === CourierOrderStatus.Processing ? order.courier_deadline_at : undefined,
  );

  const nextStatus =
    order.status === CourierOrderStatus.Processing
      ? CourierOrderStatus.CourierInShop
      : order.status === CourierOrderStatus.CourierInShop
        ? CourierOrderStatus.Delivering
        : order.status === CourierOrderStatus.Delivering
          ? CourierOrderStatus.Completed
          : null;

  const { mutate: advance, isPending } = useMutation({
    mutationFn: (status: string) =>
      CourierService.updateOrderStatus(order.shopId, order.orderId, status),
    onSuccess: (res) => {
      setStatusOpen(false);
      queryClient.invalidateQueries({ queryKey: ["courier-active-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["courier-order", order.shopId, order.orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["courier-me"] });
      queryClient.invalidateQueries({ queryKey: ["courier-history"] });

      if (res.penalty?.penalized) {
        setPenaltyAlert(res.penalty);
      } else {
        toast.success(t("status_updated"));
      }
    },
    onError: () => toast.error(t("status_update_error")),
  });

  const actionLabel =
    order.status === CourierOrderStatus.Processing
      ? t("action.arrived_at_shop")
      : order.status === CourierOrderStatus.CourierInShop
        ? t("action.picked_up")
        : t("action.delivered");

  const ActionIcon =
    order.status === CourierOrderStatus.Processing
      ? Store
      : order.status === CourierOrderStatus.CourierInShop
        ? Bike
        : PackageCheck;

  const isLate = remaining !== null && remaining <= 0;

  return (
    <>
      <Card className="py-4">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              {order.shop_name && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                  <Store className="size-3 shrink-0" />
                  <span>{order.shop_name}</span>
                </div>
              )}
              <div className="font-semibold">{order.customer_info.name}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                {t(`status.${order.status}`)}
              </span>
              {remaining !== null && (
                <span
                  className={`flex items-center gap-1 text-xs font-mono font-semibold ${
                    isLate ? "text-destructive" : "text-green-600"
                  }`}
                >
                  <Clock className="size-3" />
                  {formatCountdown(remaining)}
                </span>
              )}
            </div>
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

      {/* Penalty alert dialog */}
      <Dialog open={!!penaltyAlert} onOpenChange={() => setPenaltyAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              {penaltyAlert?.blocked
                ? t("penalty.blocked_title")
                : t("penalty.warning_title")}
            </DialogTitle>
            <DialogDescription>
              {penaltyAlert?.blocked
                ? t("penalty.blocked_description", {
                    date: penaltyAlert.blocked_until
                      ? new Date(penaltyAlert.blocked_until).toLocaleString()
                      : "",
                  })
                : t("penalty.warning_description", {
                    left: penaltyAlert?.penalties_left ?? 0,
                  })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setPenaltyAlert(null)}>
              {t("penalty.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
