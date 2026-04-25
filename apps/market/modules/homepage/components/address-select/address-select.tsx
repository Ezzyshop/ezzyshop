"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { AddressSelect as SharedAddressSelect } from "@repo/shared-modules/components/address-select/address-select";
import { LocationIcon } from "@repo/ui/icons";
import { useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useQueries, useQuery } from "@tanstack/react-query";
import { DeliveryZoneService } from "@repo/api/services/delivery-zone/index";
import { AddressService } from "@repo/api/services/address/index";
import { Button } from "@repo/ui/components/ui/button";
import { CustomLink } from "@repo/shared-modules/components/custom-link";
import { useEffect, useRef, useState } from "react";

interface IProps {
  shopId: string;
}

export const AddressSelect = ({ shopId }: IProps) => {
  const t = useTranslations("profile.address");
  const tCheckout = useTranslations("checkout.shipping");
  const { user } = useUserContext();
  const [warningOpen, setWarningOpen] = useState(false);
  const hasShownWarning = useRef(false);

  const { data: inZone, isLoading: isZoneLoading } = useQuery({
    queryKey: ["delivery-zone-check", shopId, user?.address?.lat, user?.address?.lng],
    queryFn: () =>
      DeliveryZoneService.checkZone(shopId, user!.address!.lat, user!.address!.lng),
    enabled: !!user?.address,
    staleTime: 5 * 60 * 1000,
  });

  const { data: addressesData } = useQuery({
    queryKey: ["addresses", user?._id],
    queryFn: AddressService.getAddresses,
    enabled: !!user,
  });

  const addresses = addressesData?.data ?? [];

  const addressZoneChecks = useQueries({
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
    .filter((_, i) => addressZoneChecks[i]?.data === false)
    .map((a) => a._id);

  const hasAddresses = addresses.length > 0;
  const noAddressSelected = !!user && !user.address;
  const outsideZone = !!user?.address && inZone === false;

  useEffect(() => {
    if (!user || hasShownWarning.current) return;

    if (noAddressSelected) {
      setWarningOpen(true);
      hasShownWarning.current = true;
      return;
    }

    if (!isZoneLoading && outsideZone) {
      setWarningOpen(true);
      hasShownWarning.current = true;
    }
  }, [user, noAddressSelected, outsideZone, isZoneLoading]);

  if (!user) return null;

  const isOutsideZoneMode = outsideZone;
  const warningTitle = isOutsideZoneMode
    ? t("outside-zone-title")
    : t("no-address-title");
  const warningDescription = isOutsideZoneMode
    ? t("outside-zone-description")
    : t("no-address-description");
  const actionHref = hasAddresses
    ? "/profile/addresses"
    : "/profile/addresses/add-address";
  const actionLabel = isOutsideZoneMode
    ? t("select-another")
    : hasAddresses
      ? t("go-to-addresses")
      : t("add-new-address");

  return (
    <>
      {(noAddressSelected || outsideZone) && (
        <Drawer open={warningOpen} onOpenChange={setWarningOpen}>
          <DrawerContent className="px-4 pb-8 space-y-4">
            <DrawerTitle className="text-lg font-semibold">
              {warningTitle}
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">{warningDescription}</p>
            <Button asChild className="w-full" onClick={() => setWarningOpen(false)}>
              <CustomLink href={actionHref}>{actionLabel}</CustomLink>
            </Button>
          </DrawerContent>
        </Drawer>
      )}

      <Drawer>
        <DrawerTrigger className="bg-primary/10 px-4 w-full text-primary py-2 border-y border-primary/20 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
          <LocationIcon className="size-4 min-w-4 fill-primary" />
          <span className="line-clamp-1 text-start w-fit">
            {user?.address?.address ?? t("addresses")}
          </span>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-4 mt-3 space-y-4">
          <DrawerTitle className="hidden">{t("addresses")}</DrawerTitle>
          <SharedAddressSelect
            disabledAddressIds={disabledAddressIds}
            disabledReason={tCheckout("zone-not-covered-short")}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
};
