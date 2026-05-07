"use client";

import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useProductCart } from "@repo/hooks/use-product-cart";
import {
  ChevronRight,
  Minus as MinusIcon,
  Plus as PlusIcon,
} from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";
import { useEffect } from "react";

interface IProps {
  product: IProductResponse;
  setSelectedProduct: (product: IProductResponse | null) => void;
}

export const EditorialAddButton = ({ product, setSelectedProduct }: IProps) => {
  const {
    currentQuantity,
    handleIncrement,
    handleDecrement,
    handleAddToCart,
    initializeDefaultVariant,
  } = useProductCart(product);
  const hasSingleVariant = product.variants.length === 1;

  useEffect(() => {
    if (hasSingleVariant) {
      initializeDefaultVariant();
    }
  }, [hasSingleVariant, initializeDefaultVariant]);

  const handlePrimaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentQuantity > 0) {
      handleIncrement();
    } else if (!hasSingleVariant) {
      setSelectedProduct(product);
    } else {
      handleAddToCart();
    }
  };

  const handleDecrementClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDecrement();
  };

  if (currentQuantity > 0) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 rounded-full bg-foreground p-1 shadow-md"
      >
        <button
          type="button"
          onClick={handleDecrementClick}
          className="grid size-8 place-items-center rounded-full text-background active:scale-90 transition-transform"
          aria-label="decrement"
        >
          <MinusIcon className="size-4" strokeWidth={2.4} />
        </button>
        <span className="min-w-5 text-center text-sm font-bold text-background tabular-nums">
          {currentQuantity}
        </span>
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground active:scale-90 transition-transform"
          aria-label="increment"
        >
          <PlusIcon className="size-4" strokeWidth={2.4} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePrimaryClick}
      className={cn(
        "relative grid size-9 place-items-center rounded-full bg-foreground text-background shadow-md active:scale-90 transition-transform"
      )}
      aria-label="add to cart"
    >
      <PlusIcon className="size-[18px]" strokeWidth={2.4} />
      {!hasSingleVariant && (
        <span className="absolute -top-0.5 -right-0.5 grid size-[14px] place-items-center rounded-full bg-primary text-primary-foreground border-2 border-background">
          <ChevronRight className="size-[8px]" strokeWidth={3} />
        </span>
      )}
    </button>
  );
};
