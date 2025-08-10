"use client";
import { AddressService } from "@repo/api/services/address/index";
import { useQuery } from "@tanstack/react-query";
import { AddressCard } from "./address-card";
import { AddressCardLoader } from "./address-card-loader";
import { RadioGroup } from "@repo/ui/components/ui/radio-group";
import { Button } from "@repo/ui/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import Link from "next/link";
import { useShopContext } from "@/contexts/shop.context";

interface IProps {
  isEditMode?: boolean;
}

export const AddressSelect = ({ isEditMode = false }: IProps) => {
  const t = useTranslations("profile.address");
  const { user } = useUserContext();
  const { _id: shopId } = useShopContext();
  const locale = useLocale();
  const { data, isLoading } = useQuery({
    queryKey: ["addresses", user?._id],
    queryFn: () => AddressService.getAddresses(),
    enabled: !!user,
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
          <AddressCard
            key={address._id}
            address={address}
            isEditMode={isEditMode}
          />
        ))}
      </RadioGroup>
    );
  };

  return (
    <div className="space-y-4">
      {renderContent()}

      <Button
        asChild
        variant="outline"
        className="w-full bg-primary/10 border-dashed border-primary"
      >
        <Link href={`/${locale}/${shopId}/profile/addresses/add-address`}>
          {t("add-new-address")}
        </Link>
      </Button>
    </div>
  );
};
