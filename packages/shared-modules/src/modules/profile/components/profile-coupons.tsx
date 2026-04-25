"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CouponService, IMyCoupon } from "@repo/api/services/coupon/index";
import { useCoupon } from "@repo/contexts/coupon-context/coupon.context";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { Button } from "@repo/ui/components/ui/button";
import { TicketIcon } from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";

export const ProfileCoupons = () => {
  const t = useTranslations("profile.coupons");
  const { shopId } = useParams<ICommonParams>();
  const { selectedCouponCode, selectCoupon, clearSelectedCoupon } =
    useCoupon();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["my-coupons", shopId],
    queryFn: () => CouponService.getMyCoupons(shopId),
  });

  const coupons = data?.data ?? [];

  if (isLoading) return null;
  if (coupons.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card shadow-none overflow-hidden">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <TicketIcon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium flex-grow">{t("title")}</span>
        <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {coupons.length}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t divide-y">
          {coupons.map((coupon) => (
            <CouponItem
              key={coupon._id}
              coupon={coupon}
              isSelected={selectedCouponCode === coupon.code}
              onSelect={() => selectCoupon(coupon.code)}
              onDeselect={clearSelectedCoupon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ICouponItemProps {
  coupon: IMyCoupon;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

const CouponItem = ({
  coupon,
  isSelected,
  onSelect,
  onDeselect,
}: ICouponItemProps) => {
  const t = useTranslations("profile.coupons");

  const discountLabel =
    coupon.discount_type === "PERCENTAGE"
      ? `${coupon.discount_value}%`
      : `${coupon.discount_value.toLocaleString()}`;

  const expiryDate = coupon.expires_at
    ? new Date(coupon.expires_at).toLocaleDateString()
    : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 transition-colors",
        isSelected && "bg-green-50"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold tracking-wider">
            {coupon.code}
          </span>
          {isSelected && (
            <span className="text-xs text-green-600 font-medium">
              ✓ {t("selected")}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("discount")}: {discountLabel}
          {coupon.min_order_price > 0 && (
            <> · {t("min_order")}: {coupon.min_order_price.toLocaleString()}</>
          )}
        </p>
        {expiryDate && (
          <p className="text-xs text-muted-foreground">
            {t("expires")}: {expiryDate}
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant={isSelected ? "outline" : "default"}
        className="flex-shrink-0"
        onClick={isSelected ? onDeselect : onSelect}
      >
        {isSelected ? t("remove") : t("apply")}
      </Button>
    </div>
  );
};
