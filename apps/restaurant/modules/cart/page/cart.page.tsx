"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CartItems } from "../components/cart-items/cart-items";
import { CartSummary } from "../components/cart-summary";

export const CartPage = () => {
  const t = useTranslations("cart");
  return (
    <div className="flex flex-col flex-grow">
      <PageHeader title={t("title")} />
      <div className="flex flex-col flex-grow px-4 pb-3 ">
        <div className="flex-grow">
          <CartItems />
        </div>
      </div>
      <CartSummary />
    </div>
  );
};
