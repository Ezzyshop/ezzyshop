"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CouponService } from "@repo/api/services/coupon/index";
import { useCoupon } from "@repo/contexts/coupon-context/coupon.context";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { ProfileLinkButton } from "./profile-link-button";
import { TicketIcon } from "@repo/ui/components/icons/index";

export const ProfileCouponsButton = () => {
  const t = useTranslations("profile.coupons");
  const { shopId } = useParams<ICommonParams>();
  const { selectedCouponCode } = useCoupon();

  const { data } = useQuery({
    queryKey: ["my-coupons", shopId],
    queryFn: () => CouponService.getMyCoupons(shopId),
  });

  const count = data?.data?.length ?? 0;

  if (count === 0 && !selectedCouponCode) return null;

  return (
    <ProfileLinkButton
      icon={<TicketIcon className="text-white w-4 h-4" />}
      title={t("title")}
      href="/coupons"
      badge={count > 0 ? count : undefined}
    />
  );
};
