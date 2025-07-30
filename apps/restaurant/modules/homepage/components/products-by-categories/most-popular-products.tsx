"use client";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@repo/api/services/products/product.service";
import { ICommonParams } from "@/utils/interfaces";
import { ProductsByCategories } from "./products-by-categories";

export const MostPopularProducts = ({ shopId }: ICommonParams) => {
  const { data, isLoading } = useQuery({
    queryKey: ["most-popular-products", shopId],
    queryFn: () => ProductService.getProductsByCategory(shopId, "most-popular"),
  });

  if (!data) return null;

  return (
    <ProductsByCategories
      data={data.data}
      isLoading={isLoading}
      type="most-popular"
      shopId={shopId}
    />
  );
};
