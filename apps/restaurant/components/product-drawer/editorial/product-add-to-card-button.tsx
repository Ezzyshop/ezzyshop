import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import {
  Minus as MinusIcon,
  Plus as PlusIcon,
} from "@repo/ui/components/icons/index";
import { useTranslations } from "next-intl";

interface IProps {
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleAddToCart: () => void;
  currentQuantity: number;
  selectedVariant: IProductResponse["variants"][number] | undefined;
}

const formatPrice = (n: number) =>
  n.toLocaleString("en-US").replace(/,/g, " ");

export const ProductAddToCardButton = ({
  currentQuantity,
  handleAddToCart,
  handleDecrement,
  handleIncrement,
  selectedVariant,
}: IProps) => {
  const t = useTranslations("product");
  const { currency } = useShopContext();

  const localQty = Math.max(1, currentQuantity);
  const total = (selectedVariant?.price ?? 0) * localQty;
  const isOutOfStock =
    !selectedVariant || (selectedVariant?.quantity ?? 0) <= 0;

  return (
    <div className="flex items-center gap-3 border-t border-border/60 bg-background/95 px-5 pt-3.5 pb-[max(env(safe-area-inset-bottom),22px)] backdrop-blur">
      <div className="inline-flex items-center gap-1 rounded-full bg-foreground p-1">
        <button
          type="button"
          onClick={handleDecrement}
          className="grid size-9 place-items-center rounded-full text-background active:scale-90 transition-transform disabled:opacity-50"
          disabled={currentQuantity <= 0}
          aria-label="decrement"
        >
          <MinusIcon className="size-4" strokeWidth={2.4} />
        </button>
        <span className="min-w-5 text-center text-sm font-bold text-background tabular-nums">
          {localQty}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground active:scale-90 transition-transform disabled:opacity-50"
          disabled={isOutOfStock}
          aria-label="increment"
        >
          <PlusIcon className="size-4" strokeWidth={2.4} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="flex flex-1 items-center justify-between rounded-full bg-primary px-5 py-3.5 text-[15px] font-bold text-primary-foreground shadow-[0_12px_30px_-8px_color-mix(in_oklch,var(--primary)_45%,transparent)] active:scale-[0.99] transition-transform disabled:opacity-50"
      >
        <span>{isOutOfStock ? t("out_of_stock") : t("add_to_cart")}</span>
        {!isOutOfStock && (
          <span className="tabular-nums">
            {formatPrice(total)} {currency.symbol}
          </span>
        )}
      </button>
    </div>
  );
};
