import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useWishlist } from "@repo/contexts/wishlist-context/wishlist.context";
import { useProductCart } from "@repo/hooks/use-product-cart";
import {
  Heart as HeartIconOutline,
  Star,
  X as CloseIcon,
} from "@repo/ui/components/icons/index";
import { DialogTitle } from "@repo/ui/components/ui/dialog";
import { Drawer, DrawerContent } from "@repo/ui/components/ui/drawer";
import { cn } from "@repo/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { ProductAddToCardButton } from "./product-add-to-card-button";
import { ProductVariants } from "./product-variants";

interface IProps {
  product: IProductResponse;
  setSelectedProduct: (product: IProductResponse | null) => void;
}

const formatPrice = (n: number) =>
  n.toLocaleString("en-US").replace(/,/g, " ");

export const ProductDrawer = ({ product, setSelectedProduct }: IProps) => {
  const language = useLocale() as keyof ILocale;
  const { currency } = useShopContext();
  const { isItemInWishlist, toggleItem } = useWishlist();
  const t = useTranslations("product");
  const isInWishlist = isItemInWishlist(product._id);

  const {
    selectedVariant,
    currentQuantity,
    handleIncrement,
    handleDecrement,
    handleAddToCart,
    initializeDefaultVariant,
    setSelectedVariant,
  } = useProductCart(product);

  useEffect(() => {
    initializeDefaultVariant();
  }, [initializeDefaultVariant]);

  const closeDrawer = () => setSelectedProduct(null);
  const handleAddAndClose = () => {
    handleAddToCart();
    closeDrawer();
  };
  const compareAtPrice = selectedVariant?.compare_at_price;
  const price = selectedVariant?.price ?? 0;
  const isOnSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <Drawer open={!!product} onOpenChange={closeDrawer}>
      <DrawerContent
        data-vaul-custom-container="true"
        withTrigger={false}
        className="max-h-[90vh] h-[90vh] flex flex-col bg-background rounded-t-[28px] overflow-hidden"
      >
        <DialogTitle className="hidden" />

        <div className="mt-2 flex justify-center">
          <span className="h-1 w-9 rounded-full bg-foreground/20" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-2">
          <div className="relative mx-4 mt-3 aspect-[1.2] overflow-hidden rounded-3xl bg-muted">
            <Image
              src={product.main_image}
              alt={product.name[language]}
              fill
              className="object-cover"
              sizes="(max-width: 425px) 100vw, 425px"
              priority
            />

            <button
              type="button"
              onClick={closeDrawer}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/95 text-foreground shadow-md active:scale-90 transition-transform"
              aria-label="close"
            >
              <CloseIcon className="size-[18px]" strokeWidth={2.2} />
            </button>

            <button
              type="button"
              onClick={() => toggleItem(product)}
              className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-background/95 shadow-md active:scale-90 transition-transform"
              aria-label="favorite"
            >
              <HeartIconOutline
                className={cn(
                  "size-[18px]",
                  isInWishlist
                    ? "fill-primary stroke-primary"
                    : "text-foreground"
                )}
                strokeWidth={2}
              />
            </button>

            {isOnSale && (
              <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-background">
                -{Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="px-5 pt-5">
            {product.avg_rating > 0 && (
              <div className="flex items-center gap-2">
                <Star
                  className="size-[14px] text-primary"
                  fill="currentColor"
                  strokeWidth={0}
                />
                <span className="text-[13px] font-bold text-foreground tabular-nums">
                  {product.avg_rating.toFixed(1)}
                </span>
                {product.review_count > 0 && (
                  <span className="text-[13px] text-muted-foreground">
                    · {t("reviews_count", { count: product.review_count })}
                  </span>
                )}
              </div>
            )}

            <h1 className="font-display italic mt-2 text-[34px] leading-[1.05] tracking-[-0.02em] font-medium text-foreground">
              {product.name[language]}
            </h1>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={cn(
                  "font-display tabular-nums text-[20px] font-semibold tracking-[-0.01em]",
                  isOnSale && "text-primary"
                )}
              >
                {formatPrice(price)} {currency.symbol}
              </span>
              {isOnSale && (
                <span className="text-[13px] text-muted-foreground line-through tabular-nums">
                  {formatPrice(compareAtPrice)} {currency.symbol}
                </span>
              )}
            </div>
          </div>

          {product.description?.[language] && (
            <div className="px-5 pt-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("description")}
              </span>
              <div
                className="font-display mt-2 text-[15px] leading-[1.55] text-foreground/85"
                dangerouslySetInnerHTML={{
                  __html: product.description[language],
                }}
              />
            </div>
          )}

          <ProductVariants
            variants={product.variants || []}
            setSelectedVariant={setSelectedVariant}
            selectedVariant={selectedVariant}
          />

          <div className="h-6" />
        </div>

        <ProductAddToCardButton
          selectedVariant={selectedVariant}
          currentQuantity={currentQuantity}
          handleAddToCart={handleAddAndClose}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
        />
      </DrawerContent>
    </Drawer>
  );
};
