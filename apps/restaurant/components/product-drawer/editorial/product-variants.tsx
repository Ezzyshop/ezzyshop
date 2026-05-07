import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { cn } from "@repo/ui/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface IProps {
  setSelectedVariant: (variant: IProductResponse["variants"][number]) => void;
  selectedVariant: IProductResponse["variants"][number] | undefined;
  variants: IProductResponse["variants"] | undefined;
}

const formatPrice = (n: number) =>
  n.toLocaleString("en-US").replace(/,/g, " ");

export const ProductVariants = ({
  variants,
  setSelectedVariant,
  selectedVariant,
}: IProps) => {
  const { currency } = useShopContext();
  const t = useTranslations("product");

  const cheapestPrice = useMemo(() => {
    return (
      variants?.reduce<number>((min, variant) => {
        return Math.min(min, variant.price ?? 0);
      }, Infinity) ?? 0
    );
  }, [variants]);

  if (!variants || variants.length <= 1) return null;

  return (
    <div className="px-5 pt-6">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("options")}
        </span>
      </div>

      <div className="mt-2.5 grid gap-2">
        {variants.map((variant) => {
          const priceDifference = variant.price - cheapestPrice;
          const variantLabel =
            variant.attributes.size ||
            Object.values(variant.attributes).join(" / ");
          const isSelected = selectedVariant?._id === variant._id;
          const isOutOfStock = variant.quantity <= 0;

          return (
            <button
              key={variant._id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => setSelectedVariant(variant)}
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-card p-3.5 text-left transition-colors",
                "border-[1.5px]",
                isSelected ? "border-primary" : "border-border/60",
                isOutOfStock && "opacity-50"
              )}
            >
              <span
                className={cn(
                  "grid size-[22px] shrink-0 place-items-center rounded-full transition-colors",
                  isSelected
                    ? "bg-primary border-2 border-primary"
                    : "border-[1.5px] border-border"
                )}
              >
                {isSelected && (
                  <span className="size-2 rounded-full bg-primary-foreground" />
                )}
              </span>
              <span className="flex-1 min-w-0 text-[15px] font-semibold text-foreground">
                {variantLabel}
              </span>
              <span
                className={cn(
                  "text-[13px] font-bold tabular-nums shrink-0",
                  priceDifference > 0
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {priceDifference > 0
                  ? `+${formatPrice(priceDifference)} ${currency.symbol}`
                  : t("free")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
