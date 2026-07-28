"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Loader2,
  Wallet,
  Bike,
  PackageCheck,
} from "lucide-react";
import {
  CourierService,
  CourierOrderStatus,
  PAYMENT_METHOD_CASH,
} from "@repo/api/services/courier/index";
import { MapDrawer } from "./map-drawer";
import { SwipeConfirmDrawer } from "./swipe-confirm-drawer";

export const OrderDetail = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ shopId: string; orderId: string }>();
  const [mapOpen, setMapOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["courier-order", params.shopId, params.orderId],
    queryFn: () =>
      CourierService.getOrderDetail(params.shopId, params.orderId),
    enabled: Boolean(params.shopId && params.orderId),
  });

  const order = data?.data;

  const { mutate: advance, isPending } = useMutation({
    mutationFn: (status: string) =>
      CourierService.updateOrderStatus(params.shopId, params.orderId, status),
    onSuccess: () => {
      toast.success(t("status_updated"));
      setStatusOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["courier-order", params.shopId, params.orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["courier-active-orders"] });
      queryClient.invalidateQueries({ queryKey: ["courier-me"] });
      queryClient.invalidateQueries({ queryKey: ["courier-history"] });
    },
    onError: () => toast.error(t("status_update_error")),
  });

  if (isLoading || !order) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isCash = order.payment_method_type === PAYMENT_METHOD_CASH;

  const nextStatus =
    order.status === CourierOrderStatus.Processing
      ? CourierOrderStatus.Delivering
      : order.status === CourierOrderStatus.Delivering
        ? CourierOrderStatus.Completed
        : null;
  const actionLabel =
    order.status === CourierOrderStatus.Processing
      ? t("action.picked_up")
      : t("action.delivered");
  const ActionIcon =
    order.status === CourierOrderStatus.Processing ? Bike : PackageCheck;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/active")}>
          <ArrowLeft className="size-5" />
        </Button>
        <p className="font-semibold">{t("detail.title")}</p>
        <span className="ml-auto text-xs rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
          {t(`status.${order.status}`)}
        </span>
      </header>

      <div className="flex-1 space-y-3 p-4">
        {/* Customer */}
        <Card className="py-4">
          <CardContent className="space-y-2">
            <div className="font-medium">{t("detail.customer")}</div>
            <div className="text-sm flex items-center justify-between">
              <span>{order.customer_info.name}</span>
              <a
                href={`tel:${order.customer_info.phone}`}
                className="text-primary flex items-center gap-1"
              >
                <Phone className="size-4" />
                {order.customer_info.phone}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Delivery address */}
        {order.delivery_address?.address && (
          <Card className="py-4">
            <CardContent className="space-y-3">
              <div className="font-medium">{t("detail.address")}</div>
              <div className="text-sm text-muted-foreground flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                <span>{order.delivery_address.address}</span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMapOpen(true)}
              >
                <MapPin className="size-4" />
                {t("open_map")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        <Card className="py-4">
          <CardContent className="space-y-2">
            <div className="font-medium">{t("detail.products")}</div>
            {order.products.map((p, i) => (
              <div key={i} className="text-sm flex items-center justify-between gap-2">
                <span className="text-muted-foreground">
                  {p.name} × {p.quantity}
                </span>
                <span>
                  {p.total_price.toLocaleString()} {order.currency_symbol}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="py-4">
          <CardContent className="space-y-2">
            <div className="text-sm flex items-center gap-2">
              <Wallet className="size-4" />
              <span className={isCash ? "text-orange-600 font-medium" : ""}>
                {isCash ? t("payment.cash") : t("payment.online")}
              </span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>{t("detail.total")}</span>
              <span className="text-primary">
                {order.total_price.toLocaleString()} {order.currency_symbol}
              </span>
            </div>
            {order.accepted_at && (
              <div className="text-xs text-muted-foreground">
                {t("detail.accepted_at")}:{" "}
                {dayjs(order.accepted_at).format("DD.MM.YYYY HH:mm")}
              </div>
            )}
            {order.notes && (
              <div className="text-sm">
                <span className="text-muted-foreground">{t("detail.notes")}: </span>
                {order.notes}
              </div>
            )}
          </CardContent>
        </Card>

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
      </div>

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
    </div>
  );
};
