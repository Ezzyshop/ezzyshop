"use client";

import { ICommonParams } from "@/utils/interfaces";
import { AddressService } from "@repo/api/services/address/index";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { ChevronDown, Clock, MapPin } from "@repo/ui/components/icons/index";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

export const HomeTopbar = () => {
  const { shopId, locale } = useParams<ICommonParams>();
  const router = useRouter();
  const t = useTranslations("homepage.topbar");
  const shop = useShopContext();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: AddressService.getAddresses,
  });

  const primaryAddress =
    addresses?.data?.[0]?.address ?? shop.address?.address ?? "";
  const eta = shop.eta;

  const goToAddresses = () => {
    router.push(`/${locale}/${shopId}/profile/addresses`);
  };

  return (
    <div className="flex items-center gap-3 px-4 pt-3 pb-2">
      <button
        type="button"
        onClick={goToAddresses}
        className="flex items-center gap-3 flex-1 min-w-0 text-left active:scale-[0.99] transition-transform"
      >
        <span className="grid place-items-center size-10 shrink-0 rounded-full bg-primary/10 text-primary">
          <MapPin className="size-5" strokeWidth={2} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("delivery")}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            {isLoading ? (
              <Skeleton className="h-4 w-32 rounded" />
            ) : (
              <span className="truncate text-sm font-semibold text-foreground">
                {primaryAddress || t("address_placeholder")}
              </span>
            )}
            <ChevronDown className="size-4 shrink-0" strokeWidth={2.4} />
          </span>
        </span>
      </button>

      {eta?.min != null && eta?.max != null && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-[13px] font-semibold text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <Clock className="size-[15px] text-primary" strokeWidth={2.2} />
          {t("eta_minutes", { min: eta.min, max: eta.max })}
        </span>
      )}
    </div>
  );
};
