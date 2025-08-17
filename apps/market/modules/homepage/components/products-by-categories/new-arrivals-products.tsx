"use client";
import { useQuery } from "@tanstack/react-query";
import {
  IProductParams,
  ProductService,
} from "@repo/api/services/products/index";
import { ICommonParams } from "@/utils/interfaces";
import { ProductsByCategories } from "./products-by-categories";

export const NewArrivalsProducts = ({ shopId }: ICommonParams) => {
  const params: IProductParams = {
    limit: 6,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["new-arrivals-products", shopId, params],
    queryFn: () =>
      ProductService.getProductsByCategory(shopId, "new-arrivals", params),
  });

  if (!data) return null;

  return (
    <ProductsByCategories
      data={data.data}
      isLoading={isLoading}
      type="new-arrivals"
    />
  );
};
