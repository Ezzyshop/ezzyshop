"use client";
import { AddressSelect } from "@/components/address-select/address-select";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";

export const AddressesPage = () => {
  const t = useTranslations("profile.address");

  return (
    <div>
      <PageHeader title={t("addresses")} />
      <div className="px-4">
        <AddressSelect />
      </div>
    </div>
  );
};
