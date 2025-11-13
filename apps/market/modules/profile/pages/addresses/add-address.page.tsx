"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { AddAddressForm } from "../../components/add-address/add-address-form";
import { AddressService } from "@repo/api/services/address/address.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useParams } from "next/navigation";

export const AddAddressPage = () => {
  const t = useTranslations("profile.address");
  const queryClient = useQueryClient();
  const router = useRouter();
  const { locale, shopId } = useParams();
  const { mutate: addAddress, isPending: isLoading } = useMutation({
    mutationFn: AddressService.createAddress,
    onSuccess: async () => {
      await queryClient.resetQueries({
        queryKey: ["addresses"],
        type: "all",
      });
      router.push(`/${locale}/${shopId}/profile/addresses`);
    },
  });

  return (
    <div>
      <PageHeader title={t("add-new-address")} />
      <AddAddressForm onSubmit={addAddress} isLoading={isLoading} />
    </div>
  );
};
