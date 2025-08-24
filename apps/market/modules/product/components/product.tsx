"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ProductBasicInformation } from "./product-basic-information/product-basic-information";
import { ProductAddToCart } from "./product-add-to-cart/product-add-to-cart";
import { ProductDescription } from "./product-description";
import { SimilarProducts } from "./similar-products";
import { IProductResponse } from "@repo/api/services/products/index";
import { useEffect } from "react";
import { useProductCart } from "@repo/hooks/index";
import { useLocale } from "next-intl";
import { ProductDeliveryTime } from "./product-delivery-time/product-delivery-time";

interface IProps {
  product: IProductResponse;
  shopId: string;
}

export const Product = ({ product, shopId }: IProps) => {
  const lang = useLocale();
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
    <div className="space-y-3">
      <PageHeader
        title={product.name[lang as keyof typeof product.name]}
        titleClassName="pl-8"
      />
      <div className="px-4 pb-3 space-y-3">
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
        {product.delivery_time && (
          <ProductDeliveryTime deliveryTime={product.delivery_time} />
        )}
        <ProductDescription product={product} />
        <SimilarProducts product={product} shopId={shopId} />
      </div>
    </div>
  );
};
