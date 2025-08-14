import { OrderStatus } from "@repo/api/services/order/order.enum";
import { IOrderResponse } from "@repo/api/services/order/order.interface";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card } from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { useShopContext } from "@/contexts/shop.context";
import { OrderProducts } from "./order-products";
import { Separator } from "@repo/ui/components/ui/separator";
import { CustomLink } from "@/components/custom-link";

interface IProps {
  order: IOrderResponse;
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

export const OrderCard = ({ order }: IProps) => {
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
      <div>
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
      <Separator className="my-2" />
      <OrderProducts products={order.products} />
    </Card>
  );
};
