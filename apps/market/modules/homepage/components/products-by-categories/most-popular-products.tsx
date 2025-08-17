"use client";
import { useQuery } from "@tanstack/react-query";
import {
  IProductParams,
  ProductService,
} from "@repo/api/services/products/index";
import { ICommonParams } from "@/utils/interfaces";
import { ProductsByCategories } from "./products-by-categories";

export const MostPopularProducts = ({ shopId }: ICommonParams) => {
  const params: IProductParams = {
    limit: 6,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["most-popular-products", shopId, params],
    queryFn: () =>
      ProductService.getProductsByCategory(shopId, "most-popular", params),
  });

  if (!data) return null;

  return (
    <ProductsByCategories
      data={data.data}
      isLoading={isLoading}
      type="most-popular"
    />
  );
};
