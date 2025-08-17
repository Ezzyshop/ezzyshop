"use client";
import { useShopContext } from "@/contexts/shop.context";
import { useCart } from "@repo/contexts/cart-context";
import { Card } from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import { useQuery } from "@tanstack/react-query";
import { DeliveryMethodService } from "@repo/api/services/delivery-method/delivery-method.service";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
}

export const CheckoutProductsSummary = ({ form }: IProps) => {
  const t = useTranslations();
  const deliveryMethodId = form.watch("delivery_method");
  const { currency, _id: shopId } = useShopContext();
  const { totalItems, totalPrice, totalPriceWithoutDiscount, totalDiscount } =
    useCart();

  const { data: deliveryMethod } = useQuery({
    queryKey: ["delivery-method", shopId, deliveryMethodId],
    queryFn: () =>
      DeliveryMethodService.getDeliveryMethod(shopId, deliveryMethodId),
    enabled: !!shopId && !!deliveryMethodId,
  });

  const deliveryPrice = deliveryMethod?.price ?? 0;
  const finalPrice = totalPrice + deliveryPrice;

  return (
    <div className="border-t pt-4">
      <h2 className="text-lg font-medium mb-1">Sizning buyurtmangiz</h2>

      <Card className="p-2 gap-0 shadow-none border-none">
        <div className="py-1 px-2 flex flex-row items-center justify-between shadow-none border-none">
          <p className="text-muted-foreground">
            {t("checkout.productsSummary.total-items", { count: totalItems })}
          </p>
          <p className="font-medium">{totalItems}</p>
        </div>
        {totalDiscount > 0 && (
          <>
            <div className="py-1 px-2 flex flex-row items-center justify-between shadow-none border-none">
              <p className="text-muted-foreground">
                {t("checkout.productsSummary.total-price-without-discount")}
              </p>
              <p className="font-medium">
                {totalPriceWithoutDiscount.toLocaleString()} {currency.symbol}
              </p>
            </div>
            <div className="py-1 px-2 flex flex-row items-center justify-between shadow-none border-none">
              <p className="text-muted-foreground">
                {t("checkout.productsSummary.total-discount")}
              </p>
              <p className="font-medium text-red-500">
                -{totalDiscount.toLocaleString()} {currency.symbol}
              </p>
            </div>
          </>
        )}

        <div className="py-1 px-2 flex flex-row items-center justify-between shadow-none border-none">
          <p className="text-muted-foreground">
            {t("checkout.productsSummary.total-price")}
          </p>
          <p className="font-medium">
            {totalPrice.toLocaleString()} {currency.symbol}
          </p>
        </div>
        {deliveryPrice > 0 && (
          <div className="py-1 px-2 flex flex-row items-center justify-between shadow-none border-none">
            <p className="text-muted-foreground">
              {t("checkout.productsSummary.delivery-fee")}
            </p>
            <p className="font-medium">
              +{deliveryPrice.toLocaleString()} {currency.symbol}
            </p>
          </div>
        )}
        <div className="py-1 px-2 flex flex-row items-center justify-between shadow-none border-none">
          <p className="text-muted-foreground">
            {t("checkout.productsSummary.final-price")}
          </p>
          <p className="font-medium text-primary">
            {finalPrice.toLocaleString()} {currency.symbol}
          </p>
        </div>
      </Card>
    </div>
  );
};
