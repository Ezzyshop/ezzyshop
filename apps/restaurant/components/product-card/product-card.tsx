"use client";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useWishlist } from "@repo/contexts/wishlist-context/wishlist.context";
import { HeartIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";
import { ProductAddToCardButton } from "./product-add-to-card-button";

interface IProps {
  product: IProductResponse;
  setSelectedProduct: (product: IProductResponse | null) => void;
}

export const ProductCard = ({ product, setSelectedProduct }: IProps) => {
  const locale = useLocale() as keyof ILocale;
  const { currency } = useShopContext();
  const { isItemInWishlist, toggleItem } = useWishlist();
  const t = useTranslations("price");
  const isInWishlist = isItemInWishlist(product._id);

  const mostCheapVariant = useMemo(
    () =>
      product.variants.reduce((min, variant) =>
        variant.price < min.price ? variant : min
      ),
    [product.variants]
  );

  const mostCheapPrice = mostCheapVariant.price;
  const compareAtPrice = mostCheapVariant.compare_at_price;
  const isOnSale = compareAtPrice != null && compareAtPrice > mostCheapPrice;
  const discountPercent = isOnSale
    ? Math.round(((compareAtPrice - mostCheapPrice) / compareAtPrice) * 100)
    : 0;

  const getProductPrice = () => {
    if (product.variants.length > 1) {
      return t("from", {
        price: mostCheapPrice.toLocaleString() + " " + currency.symbol,
      });
    }
    return mostCheapPrice.toLocaleString() + " " + currency.symbol;
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <Card
      className="shadow-none border-0 p-0"
      onClick={() => setSelectedProduct(product)}
    >
      <CardContent className="p-0">
        <div className="relative">
          {isOnSale && (
            <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
              -{discountPercent}%
            </span>
          )}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-10 size-8 rounded-full border-0 bg-background/80 shadow-none backdrop-blur-sm"
            onClick={handleWishlistToggle}
          >
            <HeartIcon
              className={cn(
                "size-4",
                isInWishlist && "fill-primary stroke-primary"
              )}
            />
          </Button>
          <Image
            src={product.main_image}
            alt={product.name[locale]}
            width={100}
            height={100}
            className="object-cover w-full aspect-square rounded-xl bg-muted"
            quality={100}
            fetchPriority="high"
            loading="lazy"
            sizes="full"
          />
          <ProductAddToCardButton
            product={product}
            setSelectedProduct={setSelectedProduct}
          />
        </div>
        <div className="p-2">
          <div className="mt-2 flex flex-col">
            <p className={cn("text-sm font-semibold", isOnSale && "text-red-500")}>
              {getProductPrice()}
            </p>
            {isOnSale && (
              <p className="text-xs text-muted-foreground line-through">
                {compareAtPrice!.toLocaleString()} {currency.symbol}
              </p>
            )}
          </div>
          <p className="text-xs line-clamp-2">{product.name[locale]}</p>
        </div>
      </CardContent>
    </Card>
  );
};
