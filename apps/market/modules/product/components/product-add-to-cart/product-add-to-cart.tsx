import { AddToCartButton } from "@/components/add-to-cart-button/add-to-cart-button";
import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { ProductPrices } from "./product-prices";
import { ProductVariants } from "./product-variants";

interface IProps {
  product: IProductResponse;
  selectedVariant?: IProductResponse["variants"][number];
  onVariantSelect: (variant: IProductResponse["variants"][number]) => void;
  currentQuantity?: number;
  onAddToCart: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  isAddingToCart?: boolean;
}

export const ProductAddToCart = ({
  product,
  selectedVariant,
  onVariantSelect,
  currentQuantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
  isAddingToCart = false,
}: IProps) => {
  return (
    <Card className="shadow-none border-0 p-3 gap-3">
      <ProductPrices selectedVariant={selectedVariant} />
      <ProductVariants
        product={product}
        selectedVariant={selectedVariant}
        onVariantSelect={onVariantSelect}
      />
      <AddToCartButton
        product={product}
        selectedVariant={selectedVariant}
        currentQuantity={currentQuantity}
        onAddToCart={onAddToCart}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        isLoading={isAddingToCart}
      />
    </Card>
  );
};
