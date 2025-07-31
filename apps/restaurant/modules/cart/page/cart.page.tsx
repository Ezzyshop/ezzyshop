"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CartItems } from "../components/cart-items/cart-items";
import { CartSummary } from "../components/cart-summary";
import { useViewedProducts } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { ProductsCarousel } from "@/components/products-carousel/products-carousel";
import { useQuery } from "@tanstack/react-query";
import { IProductParams } from "@repo/api/services/products/product.interface";
import { ProductService } from "@repo/api/services/products/product.service";
import { useCart } from "@repo/contexts/cart-context";

interface IProps {
  shopId: string;
}

export const CartPage = ({ shopId }: IProps) => {
  const t = useTranslations("cart");
  const { totalItems } = useCart();
  const { items } = useViewedProducts();
  const params: IProductParams = {
    limit: 6,
  };

  const { data } = useQuery({
    queryKey: ["most-popular-products", shopId, params],
    queryFn: () =>
      ProductService.getProductsByCategory(shopId, "most-popular", params),
  });

  return (
    <div className="flex flex-col flex-grow">
      <PageHeader title={t("title")} />
      <div className="flex flex-col flex-grow px-4 pb-3">
        <div className="flex-grow space-y-3">
          <CartItems shopId={shopId} />
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
    </div>
  );
};
