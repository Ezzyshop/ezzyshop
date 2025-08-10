"use client";
import { AddressService } from "@repo/api/services/address/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressCard } from "./address-card";
import { AddressCardLoader } from "./address-card-loader";
import { RadioGroup } from "@repo/ui/components/ui/radio-group";
import { Button } from "@repo/ui/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import Link from "next/link";
import { useShopContext } from "@/contexts/shop.context";
import { UserService } from "@repo/api/services/user/user.service";
import { Loader2Icon } from "@repo/ui/components/icons/index";

interface IProps {
  isEditMode?: boolean;
}

export const AddressSelect = ({ isEditMode = false }: IProps) => {
  const t = useTranslations("profile.address");
  const { user } = useUserContext();
  const { _id: shopId } = useShopContext();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["addresses", user?._id],
    queryFn: () => AddressService.getAddresses(),
    enabled: !!user,
  });

  const { mutate: updateUserAddress, isPending: isUpdating } = useMutation({
    mutationFn: UserService.updateUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return <AddressCardLoader />;
    }

    if (data?.data.length === 0) {
      return null;
    }

    return (
      <RadioGroup
        defaultValue={user?.address?._id ?? data?.data[0]?._id}
        onValueChange={(value) => updateUserAddress({ address: value })}
      >
        {data?.data.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            isEditMode={isEditMode}
          />
        ))}
        {isUpdating && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/50 z-10 flex items-center justify-center">
            <Loader2Icon className="size-6 text-primary animate-spin" />
          </div>
        )}
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
