"use client";

import { ProductsCard } from "@/components/products-card/products-card";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ProductByCategoryType } from "@repo/api/services/products/product.type";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";

interface IProps {
  data: IProductResponse[];
  isLoading: boolean;
  type: ProductByCategoryType;
}

export const ProductsByCategories = ({ data, isLoading, type }: IProps) => {
  const t = useTranslations("homepage.products");

  return (
    <div className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">{t(type)}</h2>
        <Button variant="link">
          <span>{t("view-all")}</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.map((product) => (
          <ProductsCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
