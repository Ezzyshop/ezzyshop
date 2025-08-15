import { OrderStatus } from "@repo/api/services/order/order.enum";
import { IOrderResponse } from "@repo/api/services/order/order.interface";
import { TransactionStatus } from "@repo/api/services/transaction/transaction.enum";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card } from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { useShopContext } from "@/contexts/shop.context";
import { OrderProducts } from "./order-products";
import { Separator } from "@repo/ui/components/ui/separator";
import { CustomLink } from "@/components/custom-link";
import { PaymentMethodType } from "@repo/api/services/payment-method/payment-method.enum";

import { OrderCheques } from "./order-cheque/order-cheques";

interface IProps {
  order: IOrderResponse;
  transaction: IOrderResponse["transaction"];
}

const orderStatusWithText = {
  [OrderStatus.New]: {
    text: "status.new",
    color: "bg-primary",
  },
  [OrderStatus.Processing]: {
    text: "status.processing",
    color: "bg-primary",
  },
  [OrderStatus.Delivering]: {
    text: "status.delivering",
    color: "bg-green-500",
  },
  [OrderStatus.Completed]: {
    text: "status.completed",
    color: "bg-green-500",
  },
  [OrderStatus.Cancelled]: {
    text: "status.cancelled",
    color: "bg-red-500",
  },
};

const transactionStatusWithText: Record<
  TransactionStatus,
  { text: string; color: string }
> = {
  [TransactionStatus.Pending]: {
    text: "payment-status.pending",
    color: "bg-yellow-500",
  },
  [TransactionStatus.Success]: {
    text: "payment-status.success",
    color: "bg-green-500",
  },
  [TransactionStatus.Refunded]: {
    text: "payment-status.refunded",
    color: "bg-red-500",
  },
  [TransactionStatus.Cancelled]: {
    text: "payment-status.cancelled",
    color: "bg-red-500",
  },
};

const paymentMethodWithText: Record<
  PaymentMethodType,
  { text: string; color: string }
> = {
  [PaymentMethodType.Click]: {
    text: "payment-method.click",
    color: "bg-primary",
  },
  [PaymentMethodType.CardTransfer]: {
    text: "payment-method.card-transfer",
    color: "bg-primary",
  },
  [PaymentMethodType.Cash]: {
    text: "payment-method.cash",
    color: "bg-primary",
  },
};

export const OrderCard = ({ order, transaction }: IProps) => {
  const t = useTranslations("orders");
  const { currency } = useShopContext();

  return (
    <Card className="p-4 gap-1 border-none shadow-none">
      <p className="font-medium">
        {t("order_number")} {order._id}
      </p>
      <Badge className={orderStatusWithText[order.status].color}>
        {t(orderStatusWithText[order.status].text)}
      </Badge>
      {order.delivery_address && (
        <div>
          <p className="font-medium text-sm">{t("address")}:</p>
          <p className="text-sm">{order.delivery_address?.address}</p>
          <CustomLink
            href={`/map?lat=${order.delivery_address.lat}&lng=${order.delivery_address.lng}`}
            className="text-sm text-primary"
          >
            {t("address-details")}
          </CustomLink>
        </div>
      )}
      {order.pickup_address && (
        <div>
          <p className="font-medium text-sm">{t("pickup-address")}:</p>
          <p className="text-sm">{order.pickup_address?.address}</p>
          <CustomLink
            href={`/map?lat=${order.pickup_address.lat}&lng=${order.pickup_address.lng}`}
            className="text-sm text-primary"
          >
            {t("address-details")}
          </CustomLink>
        </div>
      )}
      <div>
        <p className="font-medium text-sm">{t("date")}:</p>
        <p className="text-sm">
          {dayjs(order.createdAt).format("DD.MM.YYYY HH:mm")}
        </p>
      </div>
      <div>
        <p className="font-medium text-sm">{t("recipient")}:</p>
        <p className="text-sm">{order.customer_info.name}</p>
        <p className="text-sm">{order.customer_info.phone}</p>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm">{t("payment-method.title")}:</p>
          <p className="text-sm">
            {t(paymentMethodWithText[transaction.provider].text)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">{t("payment-status.title")}:</p>
          <p className="text-sm">
            {t(transactionStatusWithText[transaction.status].text)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">
            {t("products-quantity", { count: order.total_quantity })}:
          </p>
          <p className="text-sm">
            {(
              order.total_price - (order.delivery_method?.price || 0)
            ).toLocaleString()}{" "}
            {currency.symbol}
          </p>
        </div>

        {order.delivery_method && (
          <div className="flex items-center justify-between">
            <p className="text-sm">{t("delivery-method")}:</p>
            <p className="text-sm">
              {order.delivery_method.price.toLocaleString()} {currency.symbol}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm">{t("total-price")}:</p>
          <p className="text-sm font-bold">
            {order.total_price.toLocaleString()} {currency.symbol}
          </p>
        </div>
      </div>

      {transaction.provider === PaymentMethodType.CardTransfer &&
        transaction.status === TransactionStatus.Pending && (
          <OrderCheques transaction={transaction} />
        )}
      <Separator className="my-2" />
      <OrderProducts products={order.products} />
    </Card>
  );
};
