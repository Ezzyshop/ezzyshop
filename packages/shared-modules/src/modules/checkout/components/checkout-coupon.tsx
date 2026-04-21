"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { CouponService, ICouponApplyResponse } from "@repo/api/services/coupon/index";
import { ICheckoutForm } from "../utils/checkout.interface";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces/common.interface";
import { IData } from "@repo/api/utils/interfaces/index";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
  cartSubtotal: number;
  onCouponApplied: (discountAmount: number) => void;
  onCouponRemoved: () => void;
}

export const CheckoutCoupon = ({ form, cartSubtotal, onCouponApplied, onCouponRemoved }: IProps) => {
  const t = useTranslations();
  const { shopId } = useParams<ICommonParams>();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<ICouponApplyResponse | null>(null);

  const { mutate: applyCoupon, isPending } = useMutation({
    mutationFn: () =>
      CouponService.apply(shopId, { code: code.trim().toUpperCase(), cart_total: cartSubtotal }),
    onSuccess: (data: IData<ICouponApplyResponse>) => {
      setApplied(data.data);
      form.setValue("coupon_code", data.data.code);
      onCouponApplied(data.data.discount_amount);
    },
  });

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    form.setValue("coupon_code", undefined);
    onCouponRemoved();
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div>
          <p className="text-sm font-medium text-green-700">
            {t("checkout.coupon.applied")}: {applied.code}
          </p>
          <p className="text-xs text-green-600">
            -{applied.discount_amount.toLocaleString()} {t("checkout.coupon.discount")}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRemove}>
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder={t("checkout.coupon.placeholder")}
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        disabled={!code.trim() || isPending}
        onClick={() => applyCoupon()}
      >
        {isPending ? "..." : t("checkout.coupon.apply")}
      </Button>
    </div>
  );
};
