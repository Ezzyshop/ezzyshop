import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useProductCart } from "@repo/hooks/use-product-cart";
import { MinusIcon, PlusIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useEffect } from "react";

interface IProps {
  product: IProductResponse;
  setSelectedProduct: (product: IProductResponse | null) => void;
}

export const ProductAddToCardButton = ({
  product,
  setSelectedProduct,
}: IProps) => {
  const {
    currentQuantity,
    handleIncrement,
    handleDecrement,
    handleAddToCart,
    initializeDefaultVariant,
  } = useProductCart(product);
  const hasSingleVariant = product.variants && product.variants.length === 1;

  useEffect(() => {
    if (hasSingleVariant) {
      initializeDefaultVariant();
    }
  }, [hasSingleVariant, initializeDefaultVariant]);

  const handleAddToCartButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentQuantity > 0) {
      handleIncrement();
    } else if (!hasSingleVariant) {
      setSelectedProduct(product);
    } else {
      handleAddToCart();
    }
  };

  const handleDecrementButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDecrement();
  };

  return (
    <div
      className={cn(
        "absolute bottom-2 right-2 flex bg-background items-center gap-2 border border-input rounded-full p-1 transition-all duration-1000 justify-between",
        currentQuantity > 0 ? "w-fit" : "w-[34px] overflow-hidden"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="rounded-full size-6 p-1 border-none"
        onClick={handleAddToCartButton}
      >
        <PlusIcon className="size-full" />
      </Button>
      <span className="text-xs tabular-nums">{currentQuantity}</span>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full size-6 p-1  border-none"
        onClick={handleDecrementButton}
      >
        <MinusIcon className="size-full" />
      </Button>
    </div>
  );
};
