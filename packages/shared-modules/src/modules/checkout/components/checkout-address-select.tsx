"use client";
import { AddressSelect } from "@repo/shared-modules/components/address-select/address-select";
import { AddressService } from "@repo/api/services/address/index";
import { DeliveryZoneService } from "@repo/api/services/delivery-zone/index";
import { MapPinIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useUserContext } from "@repo/contexts/user-context/user.context";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
  shopId: string;
}
export const CheckoutAddressSelect = ({ form, shopId }: IProps) => {
  const t = useTranslations();
  const { user } = useUserContext();

  const { data: addressesData } = useQuery({
    queryKey: ["addresses", user?._id],
    queryFn: AddressService.getAddresses,
    enabled: !!user,
  });

  const addresses = addressesData?.data ?? [];

  const zoneChecks = useQueries({
    queries: addresses
      .filter((a) => a.lat && a.lng)
      .map((address) => ({
        queryKey: ["delivery-zone-check", shopId, address.lat, address.lng],
        queryFn: () => DeliveryZoneService.checkZone(shopId, address.lat, address.lng),
        staleTime: 5 * 60 * 1000,
      })),
  });

  const disabledAddressIds = addresses
    .filter((a) => a.lat && a.lng)
    .filter((_, i) => zoneChecks[i]?.data === false)
    .map((a) => a._id);

  return (
    <FormField
      control={form.control}
      name="delivery_address"
      render={({ field }) => (
        <FormItem className="flex items-start gap-2 ">
          <div className="rounded-full p-2 w-fit bg-primary/20">
            <MapPinIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground">
              {t("checkout.shipping.address.address-select")}
            </p>
            <p className="font-medium text-left">
              {form.getValues("delivery_address")?.address ||
                t("checkout.shipping.address.no-address-selected")}
            </p>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="w-full mt-3 text-black">
                  {t("checkout.shipping.address.change-address")}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-3 pt-0 space-y-4">
                <DrawerTitle className="hidden">
                  {t("checkout.shipping.address.change-address")}
                </DrawerTitle>
                <AddressSelect
                  selectedAddress={field.value}
                  disabledAddressIds={disabledAddressIds}
                  disabledReason={t("checkout.shipping.zone-not-covered-short")}
                  onAddressChange={(address) => {
                    field.onChange({
                      address: address?.address,
                      lat: address?.lat,
                      lng: address?.lng,
                    });
                  }}
                />
              </DrawerContent>
            </Drawer>
            {form.formState.errors.delivery_address && (
              <p className="text-destructive text-sm mt-2">
                {t(form.formState.errors.delivery_address.message)}
              </p>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};
