"use client";

import { EditorialAddButton } from "./editorial-add-button";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useWishlist } from "@repo/contexts/wishlist-context/wishlist.context";
import {
  Heart as HeartIconOutline,
  Star,
} from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

interface IProps {
  product: IProductResponse;
  setSelectedProduct: (product: IProductResponse | null) => void;
}

const formatPrice = (n: number) =>
  n.toLocaleString("en-US").replace(/,/g, " ");

export const EditorialDishCard = ({ product, setSelectedProduct }: IProps) => {
  const locale = useLocale() as keyof ILocale;
  const { currency } = useShopContext();
  const { isItemInWishlist, toggleItem } = useWishlist();
  const t = useTranslations("price");
  const isInWishlist = isItemInWishlist(product._id);

  const cheapestVariant = useMemo(
    () =>
      product.variants.reduce((min, variant) =>
        variant.price < min.price ? variant : min
      ),
    [product.variants]
  );
  const cheapestPrice = cheapestVariant.price;
  const compareAtPrice = cheapestVariant.compare_at_price;
  const isOnSale = compareAtPrice != null && compareAtPrice > cheapestPrice;
  const discountPercent = isOnSale
    ? Math.round(((compareAtPrice - cheapestPrice) / compareAtPrice) * 100)
    : 0;
  const hasMultipleVariants = product.variants.length > 1;

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleItem(product);
  };

  const description = product.description?.[locale];
  const rating = product.avg_rating;
  const reviewCount = product.review_count;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="grid grid-cols-[112px_1fr] sm:grid-cols-[120px_1fr] gap-4 rounded-3xl bg-card p-3 shadow-[0_1px_0_rgba(0,0,0,0.03),0_6px_18px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={product.main_image}
          alt={product.name[locale]}
          fill
          className="object-cover"
          sizes="120px"
          loading="lazy"
        />
        {isOnSale && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
            -{discountPercent}%
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-between pt-0.5">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[18px] leading-[1.15] tracking-[-0.01em] font-medium text-foreground line-clamp-2">
              {product.name[locale]}
            </h3>
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="-mt-0.5 -mr-0.5 p-1 shrink-0 text-muted-foreground"
              aria-label="wishlist"
            >
              <HeartIconOutline
                className={cn(
                  "size-5",
                  isInWishlist && "fill-primary stroke-primary"
                )}
                strokeWidth={2}
              />
            </button>
          </div>
          {description && (
            <p className="mt-1 text-[12.5px] leading-[1.4] text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star
                  className="size-3 text-primary"
                  fill="currentColor"
                  strokeWidth={0}
                />
                <span className="text-[12px] font-bold text-foreground tabular-nums">
                  {rating.toFixed(1)}
                </span>
                {reviewCount > 0 && (
                  <span className="text-[12px] text-muted-foreground">
                    · {reviewCount}
                  </span>
                )}
              </div>
            )}
            <div className="mt-0.5 flex items-baseline gap-1">
              <span
                className={cn(
                  "font-display tabular-nums text-[16px] font-semibold tracking-[-0.01em]",
                  isOnSale && "text-primary"
                )}
              >
                {hasMultipleVariants
                  ? t("from", {
                      price: `${formatPrice(cheapestPrice)} ${currency.symbol}`,
                    })
                  : `${formatPrice(cheapestPrice)} ${currency.symbol}`}
              </span>
              {isOnSale && compareAtPrice != null && (
                <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <EditorialAddButton
            product={product}
            setSelectedProduct={setSelectedProduct}
          />
        </div>
      </div>
    </div>
  );
};
