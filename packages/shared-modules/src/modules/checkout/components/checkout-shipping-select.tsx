"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { DeliveryMethodService } from "@repo/api/services/delivery-method/index";
import { DeliveryMethodDeliveryType } from "@repo/api/services/delivery-method/delivery-method.enum";
import type { IDeliveryMethodResponse } from "@repo/api/services/delivery-method/delivery-method.interface";
import { BranchService } from "@repo/api/services/branch/index";
import { DeliveryZoneService } from "@repo/api/services/delivery-zone/index";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { useParams } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Card } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useTranslations } from "next-intl";
import { CheckoutAddressSelect } from "./checkout-address-select";
import { UseFormReturn, useWatch } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import { FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";
import { useCart } from "@repo/contexts/cart-context";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
  couponDiscount?: number;
}

export const CheckoutShippingSelect = ({ form, couponDiscount = 0 }: IProps) => {
  const { shopId } = useParams<ICommonParams>();
  const { currency } = useShopContext();
  const t = useTranslations();
  const [selectedTab, setSelectedTab] = useState<"pickup" | "delivery">(
    "delivery"
  );

  const { totalPrice } = useCart();
  const effectiveTotalPrice = totalPrice - couponDiscount;

  const deliveryAddress = useWatch({ control: form.control, name: "delivery_address" });

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

  const { data: isInZone = true } = useQuery({
    queryKey: ["delivery-zone-check", shopId, deliveryAddress?.lat, deliveryAddress?.lng],
    queryFn: () => DeliveryZoneService.checkZone(shopId, deliveryAddress!.lat, deliveryAddress!.lng),
    enabled: !!shopId && selectedTab === "delivery" && !!deliveryAddress?.lat && !!deliveryAddress?.lng,
  });

  const dynamicMethodIds = useMemo(
    () =>
      (deliveryMethods ?? [])
        .filter((m) => m.deliveryType === DeliveryMethodDeliveryType.Dynamic)
        .map((m) => m._id),
    [deliveryMethods]
  );

  const calculationQueries = useQueries({
    queries: dynamicMethodIds.map((methodId) => ({
      queryKey: [
        "delivery-calc",
        shopId,
        methodId,
        deliveryAddress?.lat,
        deliveryAddress?.lng,
      ],
      queryFn: () =>
        DeliveryMethodService.calculateDelivery(
          shopId,
          methodId,
          deliveryAddress!.lat,
          deliveryAddress!.lng
        ),
      enabled:
        !!shopId &&
        selectedTab === "delivery" &&
        !!deliveryAddress?.lat &&
        !!deliveryAddress?.lng &&
        isInZone,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const calculationByMethodId = useMemo(() => {
    const map: Record<
      string,
      { price: number; distance_km: number | null; applicable: boolean; isLoading: boolean } | undefined
    > = {};
    dynamicMethodIds.forEach((methodId, idx) => {
      const q = calculationQueries[idx];
      map[methodId] = {
        price: q?.data?.price ?? 0,
        distance_km: q?.data?.distance_km ?? null,
        applicable: q?.data?.applicable ?? false,
        isLoading: q?.isLoading ?? false,
      };
    });
    return map;
  }, [dynamicMethodIds, calculationQueries]);

  const getMethodPrice = (method: IDeliveryMethodResponse) => {
    if (method.deliveryType === DeliveryMethodDeliveryType.Dynamic) {
      return calculationByMethodId[method._id]?.price ?? 0;
    }
    return method.price ?? 0;
  };

  const mostOptimalDeliveryMethod = useMemo(() => {
    if (!deliveryMethods?.length) return undefined;

    return [...deliveryMethods]
      .filter((method) => {
        if (method.min_order_price == null) return true;

        return effectiveTotalPrice >= method.min_order_price;
      })
      .sort((a, b) => getMethodPrice(a) - getMethodPrice(b))[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryMethods, effectiveTotalPrice, calculationByMethodId]);

  useEffect(() => {
    if (selectedTab !== "delivery") return;

    const current = form.getValues("delivery_method");

    if (!current) {
      if (mostOptimalDeliveryMethod) {
        form.setValue("delivery_method", mostOptimalDeliveryMethod._id);
      }
      return;
    }

    const currentMethod = deliveryMethods?.find((m) => m._id === current);
    const isCurrentDisabled =
      !!currentMethod?.min_order_price &&
      currentMethod.min_order_price > effectiveTotalPrice;

    if (isCurrentDisabled) {
      form.setValue("delivery_method", mostOptimalDeliveryMethod?._id ?? "");
    }
  }, [selectedTab, mostOptimalDeliveryMethod, effectiveTotalPrice, deliveryMethods, form]);

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

    const isOutOfZone = !!deliveryAddress?.lat && !!deliveryAddress?.lng && !isInZone;

    return (
      <div className="space-y-4">
        {isOutOfZone && (
          <Card className="p-3 shadow-none border border-destructive/40 bg-destructive/5">
            <p className="text-sm font-medium text-destructive">
              {t("checkout.shipping.zone-not-covered")}
            </p>
          </Card>
        )}
        <div className={cn(isOutOfZone && "opacity-50 pointer-events-none select-none")}>
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
                  {deliveryMethods
                    .sort((a, b) => getMethodPrice(a) - getMethodPrice(b))
                    .map((deliveryMethod) => {
                      const isDynamic =
                        deliveryMethod.deliveryType ===
                        DeliveryMethodDeliveryType.Dynamic;
                      const calc = calculationByMethodId[deliveryMethod._id];
                      const isDisabled =
                        !!deliveryMethod.min_order_price &&
                        deliveryMethod.min_order_price > effectiveTotalPrice;
                      const computedPrice = getMethodPrice(deliveryMethod);
                      const showAddressPrompt =
                        isDynamic && (!deliveryAddress?.lat || !deliveryAddress?.lng);
                      const showCalcLoading = isDynamic && calc?.isLoading;
                      const showDistance =
                        isDynamic && calc && !calc.isLoading && calc.distance_km != null;
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
                            {showAddressPrompt ? (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {t("checkout.shipping.select-address-first")}
                              </p>
                            ) : showCalcLoading ? (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {t("checkout.shipping.calculating")}
                              </p>
                            ) : computedPrice > 0 ? (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {showDistance && calc?.distance_km != null
                                  ? `${calc.distance_km} km · `
                                  : ""}
                                {computedPrice.toLocaleString()} {currency.symbol}
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
        </div>
        <CheckoutAddressSelect form={form} shopId={shopId} />
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
