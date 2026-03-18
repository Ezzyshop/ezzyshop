"use client";

import { ProductService } from "@repo/api/services/products/index";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../components/product";
import { useViewedProducts } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { useEffect } from "react";

interface IProps {
  shopId: string;
  productId: string;
}

export const ProductPage = ({ shopId, productId }: IProps) => {
  const { addViewedProduct } = useViewedProducts();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", shopId, productId],
    queryFn: () => ProductService.getProductById(shopId, productId),
  });

  // Track product view when product data is loaded
  useEffect(() => {
    if (product?.data) {
      addViewedProduct(product.data);
    }
  }, [product?.data]);

  if (isLoading) return <div>Loading...</div>;

  if (!product) return <div>Product not found</div>;

  return <Product product={product.data} shopId={shopId} />;
};
