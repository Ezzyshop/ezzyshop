"use client";

import { ProductService } from "@repo/api/services";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../components/product";

interface IProps {
  shopId: string;
  productId: string;
}

export const ProductPage = ({ shopId, productId }: IProps) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", shopId, productId],
    queryFn: () => ProductService.getProductById(shopId, productId),
  });

  if (isLoading) return <div>Loading...</div>;

  if (!product) return <div>Product not found</div>;

  return <Product product={product.data} shopId={shopId} />;
};
