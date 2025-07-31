"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ProductBasicInformation } from "./product-basic-information/product-basic-information";
import { ProductAddToCart } from "./product-add-to-cart/product-add-to-cart";
import { ProductDescription } from "./product-description";
import { SimilarProducts } from "./similar-products";
import { IProductResponse } from "@repo/api/services/products/index";
import { useEffect } from "react";
import { useProductCart } from "@repo/hooks/index";

interface IProps {
  product: IProductResponse;
  shopId: string;
}

export const Product = ({ product, shopId }: IProps) => {
  const {
    selectedVariant,
    setSelectedVariant,
    currentQuantity,
    isLoading,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    initializeDefaultVariant,
  } = useProductCart(product);

  useEffect(() => {
    initializeDefaultVariant();
  }, [initializeDefaultVariant]);

  return (
    <div className="px-4 py-3 space-y-3">
      <PageHeader />
      <ProductBasicInformation product={product} />
      <ProductAddToCart
        product={product}
        selectedVariant={selectedVariant}
        onVariantSelect={setSelectedVariant}
        currentQuantity={currentQuantity}
        onAddToCart={handleAddToCart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        isAddingToCart={isLoading}
      />
      <ProductDescription product={product} />
      <SimilarProducts product={product} shopId={shopId} />
    </div>
  );
};
