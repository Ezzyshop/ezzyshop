"use client";
import { useState } from "react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import {
  ICourierOrder,
  PAYMENT_METHOD_CASH,
} from "@repo/api/services/courier/index";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Wallet, Store } from "lucide-react";
import { AcceptDrawer } from "./accept-drawer";

interface IProps {
  order: ICourierOrder;
  onAccept: (order: ICourierOrder, etaMinutes: number) => void;
  isAccepting: boolean;
}

export const OrderCard = ({ order, onAccept, isAccepting }: IProps) => {
  const t = useTranslations("courier");
  const [acceptOpen, setAcceptOpen] = useState(false);
  const isCash = order.payment_method_type === PAYMENT_METHOD_CASH;

  return (
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
          <div className="text-primary font-bold whitespace-nowrap">
            {order.total_price.toLocaleString()} {order.currency_symbol}
          </div>
        </div>

        <a
          href={`tel:${order.customer_info.phone}`}
          className="text-sm text-muted-foreground flex items-center gap-2"
        >
          <Phone className="size-4 shrink-0" />
          {order.customer_info.phone}
        </a>

        {order.delivery_address?.address && (
          <div className="text-sm text-muted-foreground flex items-start gap-2">
            <MapPin className="size-4 shrink-0 mt-0.5" />
            <span>{order.delivery_address.address}</span>
          </div>
        )}

        <div className="text-sm flex items-center gap-2">
          <Wallet className="size-4 shrink-0" />
          <span className={isCash ? "text-orange-600 font-medium" : ""}>
            {isCash ? t("payment.cash") : t("payment.online")}
          </span>
        </div>

        {order.products.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {order.products
              .map((p) => `${p.name} × ${p.quantity}`)
              .join(", ")}
          </div>
        )}

        <Button
          className="w-full"
          size="xl"
          onClick={() => setAcceptOpen(true)}
          disabled={isAccepting}
        >
          {isAccepting ? t("accepting") : t("accept")}
        </Button>
      </CardContent>

      <AcceptDrawer
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        isCash={isCash}
        amount={order.total_price}
        currencySymbol={order.currency_symbol}
        isConfirming={isAccepting}
        onConfirm={(eta) => {
          setAcceptOpen(false);
          onAccept(order, eta);
        }}
      />
    </Card>
  );
};
