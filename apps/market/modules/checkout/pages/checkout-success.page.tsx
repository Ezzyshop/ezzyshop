import { CheckCircle2 } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/custom-link";

export const CheckoutSuccessPage = () => {
  const t = useTranslations("checkout.success");
  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-3 px-4">
      <CheckCircle2 className="w-24 h-24 text-primary" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
        <p className="text-sm text-gray-500 text-center">{t("description")}</p>
      </div>
      <div>
        <CustomLink href="/profile/orders">
          <Button className="w-full" variant="outline" size="lg">
            {t("go_to_orders")}
          </Button>
        </CustomLink>
        <CustomLink href="/home">
          <Button className="w-full mt-2" size="lg">
            {t("go_to_home")}
          </Button>
        </CustomLink>
      </div>
    </div>
  );
};
