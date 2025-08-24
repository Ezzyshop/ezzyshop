import { AlertCircle } from "@repo/ui/components/icons/index";
import { useTranslations } from "next-intl";

export const ConfirmCardTransferImportant = () => {
  const t = useTranslations();

  return (
    <div className="bg-primary/10 p-4 rounded-lg">
      <div className="flex gap-2">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">
            {t("checkout.confirm-card-transfer.important-information.title")}
          </p>
          <ul className="text-primary space-y-1">
            <li>
              {t("checkout.confirm-card-transfer.important-information.1")}
            </li>
            <li>
              {t("checkout.confirm-card-transfer.important-information.2")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
