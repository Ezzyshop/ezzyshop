"use client";

import { ProductService } from "@repo/api/services/products/index";
import { ProductViewService } from "@repo/api/services/product-view/product-view.service";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../components/product";
import { useViewedProducts } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { useEffect } from "react";

// Module-level: survives StrictMode remounts. Prevents double-fire within 2s.
const _recentlyTracked = new Map<string, number>();

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

  useEffect(() => {
    if (!product?.data) return;
    addViewedProduct(product.data);

    const key = `${shopId}:${productId}`;
    const last = _recentlyTracked.get(key) ?? 0;
    if (Date.now() - last < 2000) return;
    _recentlyTracked.set(key, Date.now());
    ProductViewService.track(shopId, productId);
  }, [product?.data]);

  if (isLoading) return <div>Loading...</div>;

  if (!product) return <div>Product not found</div>;

  return <Product product={product.data} shopId={shopId} />;
};
