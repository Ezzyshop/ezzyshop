"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CheckoutUserInfo } from "../components/checkout-user-info";
import { CheckoutShippingSelect } from "../components/checkout-shipping-select";
import { CheckoutPaymentSelect } from "../components/checkout-payment-select";
import { CheckoutProductsSummary } from "../components/checkout-products-summary";
import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { CheckoutNote } from "../components/checkout-note";
import { ICheckoutForm } from "../utils/checkout.interface";
import { useUserContext } from "@repo/contexts/user-context/user.context";

export const CheckoutPage = () => {
  const t = useTranslations();
  const { user } = useUserContext();
  const form = useForm<ICheckoutForm>({
    defaultValues: {
      customer_info: {
        name: user?.full_name,
        phone: user?.phone ?? undefined,
      },
    },
  });

  const onSubmit = (data: ICheckoutForm) => {
    console.log(data);
  };

  return (
    <div>
      <PageHeader title={t("checkout.title")} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 pb-4 space-y-4 mt-4">
          <CheckoutUserInfo form={form} />
          <CheckoutShippingSelect form={form} />
          <CheckoutPaymentSelect form={form} />
          <CheckoutNote form={form} />
          <CheckoutProductsSummary form={form} />
          <Button className="w-full" size="lg">
            {t("checkout.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
