import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { CheckIcon } from "@repo/ui/components/icons/index";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { cn } from "@repo/ui/lib/utils";
import { useMemo } from "react";

interface IProps {
  setSelectedVariant: (variant: IProductResponse["variants"][number]) => void;
  selectedVariant: IProductResponse["variants"][number] | undefined;
  variants: IProductResponse["variants"] | undefined;
}

export const ProductVariants = ({
  variants,
  setSelectedVariant,
  selectedVariant,
}: IProps) => {
  const { currency } = useShopContext();
  const cheapestPrice = useMemo(() => {
    return (
      variants?.reduce<number>((min, variant) => {
        return Math.min(min, variant.price ?? 0);
      }, Infinity) ?? 0
    );
  }, [variants]);

  if (!variants || variants.length === 1) return null;

  return (
    <div className="p-4 bg-background rounded-xl">
      <RadioGroup
        value={selectedVariant?._id}
        onValueChange={(variantId) => {
          const variant = variants.find((item) => item._id === variantId);
          if (variant) setSelectedVariant(variant);
        }}
      >
        {variants?.map((variant) => {
          const priceDifference = variant.price - cheapestPrice;
          const variantLabel =
            variant.attributes.size ||
            Object.values(variant.attributes).join(" / ");
          const inputId = `variant-${variant._id}`;

          return (
            <div key={variant._id} className="flex items-center gap-3">
              <RadioGroupItem
                disabled={variant.quantity <= 0}
                value={variant._id}
                id={inputId}
                className={cn(
                  "bg-muted border-none shadow-inner-md",
                  selectedVariant?._id === variant._id && "bg-primary "
                )}
                icon={
                  <CheckIcon
                    className={cn(
                      " absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2",
                      selectedVariant?._id === variant._id &&
                        "text-primary-foreground"
                    )}
                  />
                }
              />
              <Label htmlFor={inputId} className="cursor-pointer font-normal">
                {variantLabel}
                <span className="text-muted-foreground">
                  (+{priceDifference.toLocaleString()} {currency.symbol})
                </span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
