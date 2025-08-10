"use client";
import { AddressService } from "@repo/api/services/address/index";
import { useQuery } from "@tanstack/react-query";
import { AddressCard } from "./address-card";
import { AddressCardLoader } from "./address-card-loader";
import { RadioGroup } from "@repo/ui/components/ui/radio-group";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";

export const AddressSelect = () => {
  const t = useTranslations("profile.address");
  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: AddressService.getAddresses,
  });

  const renderContent = () => {
    if (isLoading) {
      return <AddressCardLoader />;
    }

    if (data?.data.length === 0) {
      return null;
    }

    return (
      <RadioGroup defaultValue={data?.data[0]?._id}>
        {data?.data.map((address) => (
          <AddressCard key={address._id} address={address} />
        ))}
      </RadioGroup>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {renderContent()}
      <Button
        variant="outline"
        className="w-full bg-primary/10 border-dashed border-primary"
      >
        {t("add-new-address")}
      </Button>
    </div>
  );
};
