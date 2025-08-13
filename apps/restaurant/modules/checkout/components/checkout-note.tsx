"use client";
import { Label } from "@repo/ui/components/ui/label";
import { useTranslations } from "next-intl";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import { FormField } from "@repo/ui/components/ui/form";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
}

export const CheckoutNote = ({ form }: IProps) => {
  const t = useTranslations("checkout.note");
  return (
    <div className="border-t pt-4">
      <Label className="text-lg font-medium mb-1">{t("title")}</Label>
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <Textarea
            placeholder={t("placeholder")}
            {...field}
            className="mt-2"
          />
        )}
      />
    </div>
  );
};
