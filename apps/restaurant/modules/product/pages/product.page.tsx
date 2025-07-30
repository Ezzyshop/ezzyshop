"use client";

import { PageHeader } from "@/components/page-header/page-header";
import { ProductService } from "@repo/api/services";
import { useQuery } from "@tanstack/react-query";
import { ProductAddToCart } from "../components/product-add-to-cart";
import { ProductBasicInformation } from "../components/product-basic-information/product-basic-information";
import { ProductDescription } from "../components/product-description";
import { SimilarProducts } from "../components/similar-products";

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

  return (
    <div className="px-4 py-3 space-y-3">
      <PageHeader />
      <ProductBasicInformation product={product.data} />
      <ProductAddToCart product={product.data} />
      <ProductDescription product={product.data} />
      <SimilarProducts product={product.data} shopId={shopId} />
    </div>
  );
};
