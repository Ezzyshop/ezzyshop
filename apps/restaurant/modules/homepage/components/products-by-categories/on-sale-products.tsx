"use client";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@repo/api/services/products/index";
import { ICommonParams } from "@/utils/interfaces";
import { ProductsByCategories } from "./products-by-categories";

export const OnSaleProducts = ({ shopId }: ICommonParams) => {
  const { data, isLoading } = useQuery({
    queryKey: ["on-sale-products", shopId],
    queryFn: () => ProductService.getProductsByCategory(shopId, "on-sale"),
  });

  if (!data) return null;

  return (
    <ProductsByCategories
      data={data.data}
      isLoading={isLoading}
      type="on-sale"
      shopId={shopId}
    />
  );
};
