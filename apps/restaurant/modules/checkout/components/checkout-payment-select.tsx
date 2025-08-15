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
import { UseFormReturn } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import { FormField } from "@repo/ui/components/ui/form";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
}

export const CheckoutPaymentSelect = ({ form }: IProps) => {
  const t = useTranslations();
  const { shopId, locale } = useParams<ICommonParams>();

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ["payment-methods", shopId],
    queryFn: () => PaymentMethodService.getPublicPaymentMethods(shopId),
  });

  const providerIcons: Record<PaymentMethodType, string> = {
    [PaymentMethodType.Click]: "/icons/payment-providers/click.svg",
    [PaymentMethodType.Cash]: "/images/payment-providers/cash.png",
    [PaymentMethodType.CardTransfer]: "/icons/payment-providers/card.svg",
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>{t("checkout.payment.loading")}</div>;
    }

    if (paymentMethods?.length === 0) {
      return (
        <Card className="p-3 font-semibold flex-row items-center gap-2 shadow-none border-none">
          {t("checkout.payment.no-payment-methods-found")}
        </Card>
      );
    }

    return (
      <FormField
        control={form.control}
        name="payment_method"
        render={({ field }) => (
          <>
            <RadioGroup
              {...field}
              value={field.value}
              onValueChange={field.onChange}
            >
              {paymentMethods?.map((paymentMethod) => {
                const name =
                  paymentMethod.name[locale as keyof typeof paymentMethod.name];

                return (
                  <Card
                    key={paymentMethod._id}
                    className="p-3 flex-row items-center gap-2 shadow-none border-none"
                  >
                    <Label
                      htmlFor={paymentMethod._id}
                      className="flex-grow block"
                    >
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
            {form.formState.errors.payment_method && (
              <p className="text-destructive text-sm mt-2">
                {t(form.formState.errors.payment_method.message)}
              </p>
            )}
          </>
        )}
      />
    );
  };

  return (
    <div className="border-t pt-4">
      <h2 className="text-lg font-medium mb-1">
        {t("checkout.payment.payment-method-select")}
      </h2>
      {renderContent()}
    </div>
  );
};
