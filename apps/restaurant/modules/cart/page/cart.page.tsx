"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CartItems } from "../components/cart-items/cart-items";
import { CartSummary } from "../components/cart-summary";
import { useViewedProducts } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { ProductsCarousel } from "@/components/products-carousel/products-carousel";

export const CartPage = () => {
  const t = useTranslations("cart");
  const { items } = useViewedProducts();

  return (
    <div className="flex flex-col flex-grow">
      <PageHeader title={t("title")} />
      <div className="flex flex-col flex-grow px-4 pb-3">
        <div className="flex-grow space-y-3">
          <CartItems />
          {items.length > 0 && (
            <ProductsCarousel
              products={items.map((item) => item.product)}
              title={t("viewed_products")}
            />
          )}
        </div>
      </div>
      <CartSummary />
    </div>
  );
};
