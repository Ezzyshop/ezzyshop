"use client";
import { AddressSelect } from "@/components/address-select/address-select";
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

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
}
export const CheckoutAddressSelect = ({ form }: IProps) => {
  const t = useTranslations();

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
