"use client";
import { useQuery } from "@tanstack/react-query";
import {
  PaymentMethodService,
  PaymentMethodType,
} from "@repo/api/services/payment-method/index";
import { useParams } from "next/navigation";
import { ICommonParams } from "@/utils/interfaces";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Card } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const CheckoutPaymentSelect = () => {
  const t = useTranslations("checkout.payment");
  const { shopId, locale } = useParams<ICommonParams>();

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ["payment-methods", shopId],
    queryFn: () => PaymentMethodService.getPublicPaymentMethods(shopId),
  });

  const providerIcons: Record<PaymentMethodType, string> = {
    [PaymentMethodType.Click]: "/icons/payment-providers/click.svg",
    [PaymentMethodType.Cash]: "/images/payment-providers/cash.png",
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>{t("loading")}</div>;
    }

    if (paymentMethods?.length === 0) {
      return (
        <Card className="p-3 font-semibold flex-row items-center gap-2 shadow-none border-none">
          {t("no-payment-methods-found")}
        </Card>
      );
    }

    return (
      <RadioGroup>
        {paymentMethods?.map((paymentMethod) => {
          const name =
            paymentMethod.name[locale as keyof typeof paymentMethod.name];

          return (
            <Card
              key={paymentMethod._id}
              className="p-3 flex-row items-center gap-2 shadow-none border-none"
            >
              <Label htmlFor={paymentMethod._id} className="flex-grow block">
                <div className="flex items-center gap-2">
                  <Image
                    src={providerIcons[paymentMethod.type]}
                    alt={name}
                    width={32}
                    height={32}
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-base">{name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {
                        paymentMethod.instructions[
                          locale as keyof typeof paymentMethod.instructions
                        ]
                      }
                    </p>
                  </div>
                </div>
              </Label>
              <RadioGroupItem
                value={paymentMethod._id}
                id={paymentMethod._id}
              />
            </Card>
          );
        })}
      </RadioGroup>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">{t("payment-method-select")}</h2>
      {renderContent()}
    </div>
  );
};
