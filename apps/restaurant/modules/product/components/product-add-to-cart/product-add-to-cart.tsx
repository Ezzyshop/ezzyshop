import { AddToCartButton } from "@/components/add-to-cart-button/add-to-cart-button";
import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { ProductPrices } from "./product-prices";
import { ProductVariants } from "./product-variants";

interface IProps {
  product: IProductResponse;
  selectedVariant?: IProductResponse["variants"][number];
  onVariantSelect: (variant: IProductResponse["variants"][number]) => void;
}

export const ProductAddToCart = ({
  product,
  selectedVariant,
  onVariantSelect,
}: IProps) => {
  return (
    <Card className="shadow-none border-0 p-3 gap-3">
      <ProductPrices product={product} selectedVariant={selectedVariant} />
      <ProductVariants
        product={product}
        selectedVariant={selectedVariant}
        onVariantSelect={onVariantSelect}
      />
      <AddToCartButton />
    </Card>
  );
};
