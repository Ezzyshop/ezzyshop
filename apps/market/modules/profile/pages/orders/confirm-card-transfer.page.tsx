"use client";
import { ICommonParams } from "@/utils/interfaces";
import { OrderService } from "@repo/api/services/order/order.service";
import { CheckCircle2, FileText } from "@repo/ui/components/icons/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ConfirmCardTransferUploadImage } from "../../components/confirm-card-transfer/upload-image";
import { ConfirmCardTransferImportant } from "../../components/confirm-card-transfer/important";
import { useEffect } from "react";
import { PaymentMethodType } from "@repo/api/services/payment-method/payment-method.enum";
import { TransactionChequeImageStatus } from "@repo/api/services/transaction/transaction.enum";
import { Button } from "@repo/ui/components/ui/button";

export const ConfirmCardTransferPage = () => {
  const { shopId, orderId, locale } = useParams<ICommonParams>();
  const router = useRouter();
  const t = useTranslations();

  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => OrderService.getOrder(shopId, orderId!),
    enabled: !!shopId && !!orderId,
  });

  useEffect(() => {
    if (!order) return;

    const isCardTransfer =
      order.data.transaction.provider.type === PaymentMethodType.CardTransfer;

    if (!isCardTransfer) {
      router.push(`/${locale}/${shopId}/home`);
    }
  }, [order, locale, shopId, router]);

  if (!order) return null;

  const isCardTransferVerified = order.data.transaction.cheque_images.some(
    (cheque) => cheque.status === TransactionChequeImageStatus.Verified
  );

  if (isCardTransferVerified) {
    return (
      <div className="px-4 space-y-2 flex-grow flex flex-col items-center justify-center">
        <CheckCircle2 className="size-16 text-primary mx-auto" />
        <h2 className="text-2xl text-center font-bold">
          {t("checkout.confirm-card-transfer.payment-verification.success")}
        </h2>
        <p className="text-center  text-muted-foreground max-w-sm">
          {t(
            "checkout.confirm-card-transfer.payment-verification.success-description"
          )}
        </p>
        <Button
          className="w-full"
          onClick={() => router.push(`/${locale}/${shopId}/home`)}
        >
          {t("checkout.confirm-card-transfer.payment-verification.go-to-home")}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-2 flex-grow flex flex-col items-center justify-center">
      <h2 className="text-2xl text-center font-bold">
        {t("checkout.confirm-card-transfer.title")}
      </h2>
      <p className="text-center  text-muted-foreground max-w-sm">
        {t("checkout.confirm-card-transfer.description")}
      </p>

      <Card className="w-full shadow-none bg-white mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("checkout.confirm-card-transfer.payment-verification.title")}
          </CardTitle>
          <CardDescription>
            {t(
              "checkout.confirm-card-transfer.payment-verification.description"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <ConfirmCardTransferUploadImage order={order.data} />
          <ConfirmCardTransferImportant />
        </CardContent>
      </Card>
    </div>
  );
};
