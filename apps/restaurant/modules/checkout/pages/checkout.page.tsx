import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";

export const CheckoutPage = () => {
  const t = useTranslations();

  return (
    <div>
      <PageHeader title={t("checkout.title")} />
    </div>
  );
};
