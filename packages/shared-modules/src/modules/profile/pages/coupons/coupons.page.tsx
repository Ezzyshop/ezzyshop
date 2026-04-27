"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CouponService, IMyCoupon } from "@repo/api/services/coupon/index";
import { useCoupon } from "@repo/contexts/coupon-context/coupon.context";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { Button } from "@repo/ui/components/ui/button";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { TicketIcon } from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";

export const CouponsPage = () => {
  const t = useTranslations("profile.coupons");
  const { shopId } = useParams<ICommonParams>();
  const { selectedCouponCode, selectCoupon, clearSelectedCoupon } = useCoupon();

  const { data, isLoading } = useQuery({
    queryKey: ["my-coupons", shopId],
    queryFn: () => CouponService.getMyCoupons(shopId),
  });

  const coupons = data?.data ?? [];

  return (
    <div>
      <PageHeader title={t("title")} />
      <div className="px-4 pb-4 space-y-3 mt-4">
        {isLoading && (
          <>
            <CouponSkeleton />
            <CouponSkeleton />
            <CouponSkeleton />
          </>
        )}

        {!isLoading && coupons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <TicketIcon className="w-12 h-12 opacity-30" />
            <p className="text-sm">{t("empty")}</p>
          </div>
        )}

        {coupons.map((coupon) => (
          <CouponCard
            key={coupon._id}
            coupon={coupon}
            isSelected={selectedCouponCode === coupon.code}
            onSelect={() => selectCoupon(coupon.code)}
            onDeselect={clearSelectedCoupon}
          />
        ))}
      </div>
    </div>
  );
};

interface ICouponCardProps {
  coupon: IMyCoupon;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

const CouponCard = ({
  coupon,
  isSelected,
  onSelect,
  onDeselect,
}: ICouponCardProps) => {
  const t = useTranslations("profile.coupons");

  const usesLeft =
    coupon.max_uses !== null ? coupon.max_uses - coupon.used_count : null;
  const isGloballyExhausted = usesLeft !== null && usesLeft <= 0;
  const isUserLimitReached =
    coupon.max_uses_per_user !== null &&
    coupon.user_used_count >= coupon.max_uses_per_user;
  const isExhausted = isGloballyExhausted || isUserLimitReached;

  useEffect(() => {
    if (isSelected && isExhausted) {
      onDeselect();
    }
  }, [isSelected, isExhausted, onDeselect]);

  const discountLabel =
    coupon.discount_type === "PERCENTAGE"
      ? `${coupon.discount_value}%`
      : coupon.discount_value.toLocaleString();

  const expiryDate = coupon.expires_at
    ? new Date(coupon.expires_at).toLocaleDateString()
    : null;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 space-y-3 transition-colors",
        isSelected && !isExhausted && "border-primary bg-primary/5",
        isExhausted && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold tracking-widest">
              {coupon.code}
            </span>
            {isSelected && !isExhausted && (
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                ✓ {t("selected")}
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-primary">
            {coupon.discount_type === "PERCENTAGE"
              ? `-${discountLabel}`
              : `-${discountLabel}`}
          </p>
        </div>
        <Button
          size="sm"
          variant={isSelected && !isExhausted ? "outline" : "default"}
          className="flex-shrink-0"
          disabled={isExhausted}
          onClick={isSelected ? onDeselect : onSelect}
        >
          {isExhausted ? t("used_up") : isSelected ? t("remove") : t("apply")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground border-t pt-3">
        {coupon.min_order_price > 0 && (
          <span>
            {t("min_order")}: {coupon.min_order_price.toLocaleString()}
          </span>
        )}
        {expiryDate && (
          <span>
            {t("expires")}: {expiryDate}
          </span>
        )}
        {coupon.max_uses !== null && (
          <span>
            {t("uses_left")}: {Math.max(0, coupon.max_uses - coupon.used_count)}
          </span>
        )}
      </div>
    </div>
  );
};

const CouponSkeleton = () => (
  <div className="rounded-xl border bg-card p-4 space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-20" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
    <div className="border-t pt-3">
      <Skeleton className="h-4 w-48" />
    </div>
  </div>
);
