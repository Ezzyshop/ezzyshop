import { PageHeader } from "@/components/page-header/page-header";
import { ProductBasicInformation } from "./product-basic-information/product-basic-information";
import { ProductAddToCart } from "./product-add-to-cart/product-add-to-cart";
import { ProductDescription } from "./product-description";
import { SimilarProducts } from "./similar-products";
import { IProductResponse } from "@repo/api/services";
import { useState } from "react";

interface IProps {
  product: IProductResponse;
  shopId: string;
}

export const Product = ({ product, shopId }: IProps) => {
  const [selectedVariant, setSelectedVariant] =
    useState<IProductResponse["variants"][number]>();

  return (
    <div className="px-4 py-3 space-y-3">
      <PageHeader />
      <ProductBasicInformation product={product} />
      <ProductAddToCart product={product} />
      <ProductDescription product={product} />
      <SimilarProducts product={product} shopId={shopId} />
    </div>
  );
};
