"use client";
import { AddressSelect } from "@/components/address-select/address-select";
import { PageHeader } from "@/components/page-header/page-header";
import { EditIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const AddressesPage = () => {
  const t = useTranslations("profile.address");
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <PageHeader
        title={t("addresses")}
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
        <AddressSelect isEditMode={isEditMode} />
      </div>
    </div>
  );
};
