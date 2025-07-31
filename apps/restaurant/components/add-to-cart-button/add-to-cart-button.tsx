import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { IProductResponse } from "@repo/api/services/products/index";
import { useTranslations } from "next-intl";

interface IProps {
  product: IProductResponse;
  selectedVariant?: IProductResponse["variants"][number];
  currentQuantity?: number;
  onAddToCart: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const AddToCartButton = ({
  product,
  selectedVariant,
  currentQuantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
  disabled = false,
  isLoading = false,
}: IProps) => {
  const t = useTranslations("product");
  const availableStock =
    selectedVariant?.quantity ?? product.variants?.[0]?.quantity ?? 0;
  const isOutOfStock = availableStock <= 0;
  const isAtMaxQuantity = currentQuantity >= availableStock;
  const isInCart = currentQuantity > 0;

  if (isInCart) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-lg"
          onClick={onDecrement}
          disabled={disabled || isLoading}
        >
          <MinusIcon className="w-4 h-4" />
        </Button>

        <div className="flex-1 h-12 rounded-lg border border-input bg-background flex items-center justify-center font-medium">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-base">{currentQuantity}</span>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-lg"
          onClick={onIncrement}
          disabled={disabled || isLoading || isAtMaxQuantity}
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  const getButtonText = () => {
    if (isOutOfStock) return t("out_of_stock");
    return t("add_to_cart");
  };

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={onAddToCart}
      disabled={disabled || isLoading || isOutOfStock}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {t("adding")}
        </div>
      ) : (
        <>
          <ShoppingCartIcon className="w-4 h-4" />
          {getButtonText()}
        </>
      )}
    </Button>
  );
};
