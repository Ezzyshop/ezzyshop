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
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Card } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { useShopContext } from "@/contexts/shop.context";
import { useTranslations } from "next-intl";
import { CheckoutAddressSelect } from "./checkout-address-select";

export const CheckoutShippingSelect = () => {
  const { shopId } = useParams<ICommonParams>();
  const { currency } = useShopContext();
  const t = useTranslations("checkout.shipping");
  const [selectedTab, setSelectedTab] = useState<"pickup" | "delivery">(
    "delivery"
  );

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
          {t("no-branches-found")}
        </Card>
      );
    }

    return (
      <RadioGroup>
        {branches?.map((branch) => (
          <Card
            key={branch._id}
            className="p-3 flex-row items-center gap-2 shadow-none border-none"
          >
            <Label htmlFor={branch._id} className="flex-grow block">
              <h3 className="font-medium text-base">{branch.name.uz}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {branch.address.address}
              </p>
            </Label>
            <RadioGroupItem value={branch._id} id={branch._id} />
          </Card>
        ))}
      </RadioGroup>
    );
  };

  const getDeliveryMethodsContent = () => {
    if (!deliveryMethods?.length) {
      return (
        <Card className="p-3 flex-row items-center gap-2 shadow-none border-none">
          {t("no-delivery-methods-found")}
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <RadioGroup>
          {deliveryMethods?.map((deliveryMethod) => (
            <Card
              key={deliveryMethod._id}
              className="p-3 flex-row items-center gap-2 shadow-none border-none"
            >
              <Label htmlFor={deliveryMethod._id} className="flex-grow block">
                <h3 className="font-medium text-base">
                  {deliveryMethod.name.uz}
                </h3>
                {deliveryMethod.price ? (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {deliveryMethod?.price?.toLocaleString()} {currency.symbol}
                  </p>
                ) : null}
              </Label>
              <RadioGroupItem
                value={deliveryMethod._id}
                id={deliveryMethod._id}
              />
            </Card>
          ))}
        </RadioGroup>
        <CheckoutAddressSelect />
      </div>
    );
  };

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
            <TabsTrigger value="delivery">{t("delivery")}</TabsTrigger>
            <TabsTrigger value="pickup">{t("pickup")}</TabsTrigger>
          </TabsList>
        ) : (
          <p className="text-lg font-medium">{t("delivery-options")}</p>
        )}

        <TabsContent value="pickup">{getBranchesContent()}</TabsContent>
        <TabsContent value="delivery">
          {getDeliveryMethodsContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
