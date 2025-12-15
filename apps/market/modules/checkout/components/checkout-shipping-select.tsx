"use client";

import { useQuery } from "@tanstack/react-query";
import { DeliveryMethodService } from "@repo/api/services/delivery-method/index";
import { BranchService } from "@repo/api/services/branch/index";
import { ICommonParams } from "@/utils/interfaces";
import { useParams } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Card } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { useShopContext } from "@/contexts/shop.context";
import { useTranslations } from "next-intl";
import { CheckoutAddressSelect } from "./checkout-address-select";
import { UseFormReturn } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import { FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";
import { useCart } from "@repo/contexts/cart-context";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
}

export const CheckoutShippingSelect = ({ form }: IProps) => {
  const { shopId } = useParams<ICommonParams>();
  const { currency } = useShopContext();
  const t = useTranslations();
  const [selectedTab, setSelectedTab] = useState<"pickup" | "delivery">(
    "delivery"
  );

  const { totalPrice } = useCart();

  const { data: deliveryMethods } = useQuery({
    queryKey: ["delivery-methods", shopId],
    queryFn: () => DeliveryMethodService.getDeliveryMethods(shopId),
    enabled: !!shopId,
  });

  const { data: branches } = useQuery({
    queryKey: ["branches", shopId],
    queryFn: () => BranchService.getPublicBranches(shopId),
    enabled: !!shopId,
  });

  const getBranchesContent = () => {
    if (!branches?.length) {
      return (
        <Card className="p-3 flex-row items-center gap-2 shadow-none border-none">
          {t("checkout.shipping.no-branches-found")}
        </Card>
      );
    }

    return (
      <FormField
        control={form.control}
        name="pickup_address"
        render={({ field }) => (
          <FormItem>
            <RadioGroup
              {...field}
              value={field.value}
              onValueChange={(e) => {
                field.onChange(e);
                form.clearErrors("pickup_location_and_delivery_method");
              }}
            >
              {branches?.map((branch) => {
                if (!branch.pickup_enabled) {
                  return;
                }

                return (
                  <Card
                    key={branch._id}
                    className="p-3 flex-row items-center gap-2 shadow-none border-none"
                  >
                    <Label htmlFor={branch._id} className="flex-grow block">
                      <h3 className="font-medium text-base">
                        {branch.name.uz}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {branch.address.address}
                      </p>
                    </Label>
                    <RadioGroupItem value={branch._id} id={branch._id} />
                  </Card>
                );
              })}
            </RadioGroup>
            {form.formState.errors.pickup_location_and_delivery_method && (
              <FormMessage>
                {t(
                  form.formState.errors.pickup_location_and_delivery_method
                    ?.message
                )}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  };

  const getDeliveryMethodsContent = () => {
    if (!deliveryMethods?.length) {
      return (
        <Card className="p-3 flex-row items-center gap-2 shadow-none border-none">
          {t("checkout.shipping.no-delivery-methods-found")}
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="delivery_method"
          render={({ field }) => (
            <FormItem>
              <RadioGroup
                {...field}
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                  form.clearErrors("pickup_location_and_delivery_method");
                }}
              >
                {deliveryMethods?.map((deliveryMethod) => {
                  const isDisabled =
                    !!deliveryMethod.min_order_price &&
                    deliveryMethod.min_order_price > totalPrice;
                  return (
                    <Card
                      key={deliveryMethod._id}
                      className={cn(
                        "p-3 flex-row items-center gap-2 shadow-none border-none",
                        isDisabled && "opacity-50"
                      )}
                    >
                      <Label
                        htmlFor={deliveryMethod._id}
                        className="flex-grow block"
                      >
                        <h3 className="font-medium text-base">
                          {deliveryMethod.name.uz}
                        </h3>
                        {deliveryMethod.price ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {deliveryMethod?.price?.toLocaleString()}{" "}
                            {currency.symbol}
                          </p>
                        ) : null}
                        {isDisabled && (
                          <p className="text-sm text-red-500 line-clamp-2">
                            {t("checkout.shipping.min-order-price")}{" "}
                            {deliveryMethod.min_order_price?.toLocaleString()}{" "}
                            {currency.symbol}
                          </p>
                        )}
                      </Label>
                      <RadioGroupItem
                        value={deliveryMethod._id}
                        id={deliveryMethod._id}
                        disabled={isDisabled}
                      />
                    </Card>
                  );
                })}
              </RadioGroup>
              {form.formState.errors.pickup_location_and_delivery_method && (
                <FormMessage>
                  {t(
                    form.formState.errors.pickup_location_and_delivery_method
                      ?.message
                  )}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <CheckoutAddressSelect form={form} />
      </div>
    );
  };

  useEffect(() => {
    form.resetField("pickup_address");
    form.resetField("delivery_method");
    form.resetField("delivery_address");
  }, [selectedTab, form]);

  return (
    <div className="border-t pt-4">
      <Tabs
        value={selectedTab}
        onValueChange={(value) =>
          setSelectedTab(value as "pickup" | "delivery")
        }
      >
        {branches?.length && deliveryMethods?.length ? (
          <TabsList className="w-full">
            <TabsTrigger value="delivery">
              {t("checkout.shipping.delivery")}
            </TabsTrigger>
            <TabsTrigger value="pickup">
              {t("checkout.shipping.pickup")}
            </TabsTrigger>
          </TabsList>
        ) : (
          <p className="text-lg font-medium">
            {t("checkout.shipping.delivery-options")}
          </p>
        )}

        <TabsContent value="pickup">{getBranchesContent()}</TabsContent>
        <TabsContent value="delivery">
          {getDeliveryMethodsContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
