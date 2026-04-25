"use client";
import { AddressSelect } from "@repo/shared-modules/components/address-select/address-select";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { EditIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AddressService } from "@repo/api/services/address/index";
import { DeliveryZoneService } from "@repo/api/services/delivery-zone/index";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";

export const AddressesPage = () => {
  const t = useTranslations();
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useUserContext();
  const { _id: shopId } = useShopContext();

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

  const addressesWithCoords = addresses.filter((a) => a.lat && a.lng);
  const disabledAddressIds = addressesWithCoords
    .filter((_, i) => zoneChecks[i]?.data === false)
    .map((a) => a._id);

  return (
    <div>
      <PageHeader
        title={t("profile.address.addresses")}
        rightElement={
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
        }
      />
      <div className="px-4">
        <AddressSelect
          isEditMode={isEditMode}
          disabledAddressIds={disabledAddressIds}
          disabledReason={t("checkout.shipping.zone-not-covered-short")}
        />
      </div>
    </div>
  );
};
