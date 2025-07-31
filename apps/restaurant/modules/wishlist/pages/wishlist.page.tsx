"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ProductsGrid } from "@/components/products-group/products-grid";
import { useWishlist } from "@repo/contexts/wishlist-context/wishlist.context";
import { useTranslations } from "next-intl";

export const WishlistPage = () => {
  const { items } = useWishlist();
  const t = useTranslations("wishlist");

  return (
    <div className="px-4 py-3 space-y-3">
      <PageHeader title={t("title")} />
      <ProductsGrid data={items.map((d) => d.product)} isLoading={false} />
    </div>
  );
};
