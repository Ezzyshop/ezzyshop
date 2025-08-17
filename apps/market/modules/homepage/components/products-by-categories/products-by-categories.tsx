"use client";

import { CustomLink } from "@/components/custom-link";
import { ProductsGrid } from "@/components/products-group/products-grid";
import {
  IProductResponse,
  ProductByCategoryType,
} from "@repo/api/services/products/index";
import { Button } from "@repo/ui/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

interface IProps {
  data: IProductResponse[];
  isLoading: boolean;
  type: ProductByCategoryType;
}

export const ProductsByCategories = ({ data, isLoading, type }: IProps) => {
  const language = useLocale();
  const t = useTranslations("homepage.products");

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">{t(type)}</h2>

        <Button variant="link">
          <CustomLink href={`/categories/${type}`} locale={language}>
            {t("view-all")}
          </CustomLink>
        </Button>
      </div>

      <ProductsGrid data={data} isLoading={isLoading} />
    </div>
  );
};
