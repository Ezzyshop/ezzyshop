"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  Loader2,
} from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { CustomLink } from "@repo/shared-modules/components/custom-link";
import { OrderService } from "@repo/api/services/order/index";
import { TransactionStatus } from "@repo/api/services/transaction/transaction.enum";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20;

export const CheckoutReturnPage = () => {
  const t = useTranslations("checkout.return");
  const { shopId } = useParams<ICommonParams>();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [pollCount, setPollCount] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["order-return", shopId, orderId],
    queryFn: () => OrderService.getOrder(shopId, orderId!),
    enabled: !!orderId,
    refetchInterval: false,
  });

  const status = data?.data.transaction.status;

  useEffect(() => {
    if (!orderId) return;
    if (status === TransactionStatus.Success || status === TransactionStatus.Cancelled) return;
    if (pollCount >= MAX_POLLS) return;

    const timer = setTimeout(() => {
      refetch();
      setPollCount((c) => c + 1);
    }, POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [orderId, status, pollCount, refetch]);

  if (!orderId) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-3 px-4">
        <XCircle className="w-24 h-24 text-destructive" />
        <h1 className="text-2xl font-bold text-center">{t("missing_order")}</h1>
        <CustomLink href="/home">
          <Button size="lg">{t("go_to_home")}</Button>
        </CustomLink>
      </div>
    );
  }

  if (isLoading || (!status && pollCount < MAX_POLLS)) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="w-24 h-24 text-primary animate-spin" />
        <h1 className="text-2xl font-bold text-center">{t("checking")}</h1>
        <p className="text-sm text-gray-500 text-center">
          {t("checking_description")}
        </p>
      </div>
    );
  }

  const isPaid = status === TransactionStatus.Success;
  const isCancelled = status === TransactionStatus.Cancelled;

  if (isPaid) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-3 px-4">
        <CheckCircle2 className="w-24 h-24 text-primary" />
        <h1 className="text-2xl font-bold text-center">{t("success_title")}</h1>
        <p className="text-sm text-gray-500 text-center">
          {t("success_description")}
        </p>
        <div className="w-full max-w-sm space-y-2">
          <CustomLink href={`/profile/orders/${orderId}`}>
            <Button className="w-full" variant="outline" size="lg">
              {t("view_order")}
            </Button>
          </CustomLink>
          <CustomLink href="/home">
            <Button className="w-full" size="lg">
              {t("go_to_home")}
            </Button>
          </CustomLink>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-3 px-4">
        <XCircle className="w-24 h-24 text-destructive" />
        <h1 className="text-2xl font-bold text-center">{t("failed_title")}</h1>
        <p className="text-sm text-gray-500 text-center">
          {t("failed_description")}
        </p>
        <div className="w-full max-w-sm space-y-2">
          <CustomLink href="/cart">
            <Button className="w-full" size="lg">
              {t("retry")}
            </Button>
          </CustomLink>
          <CustomLink href="/home">
            <Button className="w-full" variant="outline" size="lg">
              {t("go_to_home")}
            </Button>
          </CustomLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-3 px-4">
      <Loader2 className="w-24 h-24 text-primary" />
      <h1 className="text-2xl font-bold text-center">{t("pending_title")}</h1>
      <p className="text-sm text-gray-500 text-center">
        {t("pending_description")}
      </p>
      <CustomLink href={`/profile/orders/${orderId}`}>
        <Button className="w-full" size="lg">
          {t("view_order")}
        </Button>
      </CustomLink>
    </div>
  );
};
