"use client";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CartItems } from "../components/cart-items/cart-items";
import { CartSummary } from "../components/cart-summary";
import { useViewedProducts } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { ProductsCarousel } from "@repo/shared-modules/components/products-carousel/products-carousel";
import { useQuery } from "@tanstack/react-query";
import { IProductParams } from "@repo/api/services/products/product.interface";
import { ProductService } from "@repo/api/services/products/product.service";
import { useCart } from "@repo/contexts/cart-context";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Trash2 } from "@repo/ui/components/icons/index";
import { ConfirmDrawer } from "../components/confirm-drawer";

interface IProps {
  shopId: string;
}

export const CartPage = ({ shopId }: IProps) => {
  const t = useTranslations("cart");
  const { totalItems, clearCart } = useCart();
  const { items } = useViewedProducts();
  const [clearOpen, setClearOpen] = useState(false);

  const params: IProductParams = {
    limit: 6,
  };

  const { data } = useQuery({
    queryKey: ["most-popular-products", shopId, params],
    queryFn: () =>
      ProductService.getProductsByCategory(shopId, "most-popular", params),
  });

  const clearCartRight =
    totalItems > 0 ? (
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={() => setClearOpen(true)}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    ) : undefined;

  return (
    <div className="flex flex-col flex-grow">
      <PageHeader title={t("title")} rightElement={clearCartRight} />
      <div className="flex flex-col flex-grow px-4 pb-3">
        <div className="flex-grow space-y-3">
          <CartItems />
          {items.length > 0 && (
            <ProductsCarousel
              products={items.map((item) => item.product)}
              title={t("viewed_products")}
            />
          )}
          {data?.data.length ? (
            <ProductsCarousel products={data.data} title={t("most-popular")} />
          ) : null}
        </div>
      </div>
      {totalItems > 0 && <CartSummary />}
      <ConfirmDrawer
        open={clearOpen}
        onOpenChange={setClearOpen}
        title={t("clear_cart_confirm.title")}
        description={t("clear_cart_confirm.description")}
        confirmLabel={t("clear_cart_confirm.yes")}
        cancelLabel={t("clear_cart_confirm.no")}
        onConfirm={clearCart}
      />
    </div>
  );
};
