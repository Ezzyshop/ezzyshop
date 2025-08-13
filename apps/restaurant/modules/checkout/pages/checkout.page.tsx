import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CheckoutUserInfo } from "../components/checkout-user-info";
import { CheckoutShippingSelect } from "../components/checkout-shipping-select";
import { CheckoutPaymentSelect } from "../components/checkout-payment-select";
import { CheckoutProductsSummary } from "../components/checkout-products-summary";

export const CheckoutPage = () => {
  const t = useTranslations();

  return (
    <div>
      <PageHeader title={t("checkout.title")} />
      <div className="px-4 space-y-4 mt-4">
        <CheckoutUserInfo />
        <CheckoutShippingSelect />
        <CheckoutPaymentSelect />
        <CheckoutProductsSummary />
      </div>
    </div>
  );
};
