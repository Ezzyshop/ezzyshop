"use client";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@repo/api/services/products/index";
import { ICommonParams } from "@/utils/interfaces";
import { ProductsByCategories } from "./products-by-categories";

export const NewArrivalsProducts = ({ shopId }: ICommonParams) => {
  const { data, isLoading } = useQuery({
    queryKey: ["new-arrivals-products", shopId],
    queryFn: () => ProductService.getProductsByCategory(shopId, "new-arrivals"),
  });

  if (!data) return null;

  return (
    <ProductsByCategories
      data={data.data}
      isLoading={isLoading}
      type="new-arrivals"
      shopId={shopId}
    />
  );
};
