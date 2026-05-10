"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { CreditCard, Loader2 } from "@repo/ui/components/icons/index";
import { OrderService } from "@repo/api/services/order/index";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { redirectToPaymentProvider } from "@repo/shared-modules/modules/checkout/utils/payment-redirect";

interface IProps {
  orderId: string;
  expiresAt: Date;
}

const formatRemaining = (ms: number): string => {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const OrderPayNow = ({ orderId, expiresAt }: IProps) => {
  const t = useTranslations("orders.pay-now");
  const { shopId, locale } = useParams<ICommonParams>();
  const [remainingMs, setRemainingMs] = useState(
    () => expiresAt.getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(expiresAt.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const { mutate: getPaymentLink, isPending } = useMutation({
    mutationFn: () => {
      const returnUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/${locale}/${shopId}/checkout/return`
          : undefined;
      return OrderService.getOrderPaymentLink(shopId, orderId, {
        return_url: returnUrl,
        locale: locale as "uz" | "ru" | "en",
      });
    },
    onSuccess: (data) => {
      redirectToPaymentProvider({
        provider: data.data.provider,
        web_url: data.data.web_url,
        app_url: data.data.app_url,
      });
    },
  });

  if (remainingMs <= 0) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/5 p-3 text-sm">
        <p className="font-medium text-destructive">{t("expired_title")}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t("expired_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-yellow-500/40 bg-yellow-500/5 p-3 space-y-2">
      <div>
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
          ⚠️ {t("title")}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("description")}
        </p>
      </div>
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isPending}
        onClick={() => getPaymentLink()}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {t("pay_button")}
      </Button>
      <p className="text-xs text-muted-foreground text-center tabular-nums">
        {t("auto_cancel_in", { time: formatRemaining(remainingMs) })}
      </p>
    </div>
  );
};
