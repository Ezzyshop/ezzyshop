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

  const mostCheapPrice = useMemo(
    () =>
      product.variants.reduce((min, variant) => {
        return Math.min(min, variant.price);
      }, Infinity),
    [product.variants]
  );

  const getProductPrice = () => {
    let priceText = "";
    if (product.variants.length > 1) {
      priceText = t("from", {
        price: mostCheapPrice.toLocaleString() + " " + currency.symbol,
      });
    } else {
      priceText = mostCheapPrice.toLocaleString() + " " + currency.symbol;
    }

    return priceText;
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
          <p className="text-sm font-semibold mt-2">{getProductPrice()}</p>
          <p className="text-xs line-clamp-2">{product.name[locale]}</p>
        </div>
      </CardContent>
    </Card>
  );
};
