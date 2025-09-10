"use client";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import Image from "next/image";
import { Card } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useShopContext } from "@/contexts/shop.context";
import { Button } from "@repo/ui/components/ui/button";
import { ShoppingCartIcon } from "@repo/ui/components/icons/index";
import { ProductBadges } from "./product-badges";
import { AddToCartButton } from "../add-to-cart-button/add-to-cart-button";
import { ProductVariantDrawer } from "../product-variant-drawer/product-variant-drawer";
import { useState, useEffect } from "react";
import { useProductCart } from "@repo/hooks/index";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { CustomLink } from "../custom-link";

interface IProps {
  product: IProductResponse;
}

export const ProductsCard = ({ product }: IProps) => {
  const locale = useLocale() as keyof ILocale;
  const t = useTranslations("product");
  const { currency } = useShopContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    selectedVariant,
    currentQuantity,
    isLoading,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    initializeDefaultVariant,
  } = useProductCart(product);

  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const hasSingleVariant = product.variants && product.variants.length === 1;
  const hasNoVariants = !product.variants || product.variants.length === 0;

  useEffect(() => {
    if (hasSingleVariant) {
      initializeDefaultVariant();
    }
  }, [hasSingleVariant, initializeDefaultVariant]);

  const handleButtonClick = () => {
    if (hasMultipleVariants) {
      setIsDrawerOpen(true);
    } else if (hasSingleVariant) {
      handleAddToCart();
    }
  };

  const getButtonProps = () => {
    if (hasSingleVariant) {
      return {
        product,
        selectedVariant,
        currentQuantity,
        onAddToCart: handleAddToCart,
        onIncrement: handleIncrement,
        onDecrement: handleDecrement,
        isLoading,
      };
    }

    if (hasMultipleVariants) {
      return {
        product,
        selectedVariant: undefined,
        currentQuantity: 0,
        onAddToCart: handleButtonClick,
        onIncrement: undefined,
        onDecrement: undefined,
        isLoading: false,
      };
    }

    // Fallback (shouldn't be reached for hasNoVariants)
    return {
      product,
      selectedVariant: undefined,
      currentQuantity: 0,
      onAddToCart: () => {},
      onIncrement: undefined,
      onDecrement: undefined,
      isLoading: false,
    };
  };

  const allImages = product.variants.flatMap((variant) => variant.images);
  const firstAvailableVariant =
    product.variants.find(
      (variant) => variant.compare_at_price != null && variant.quantity > 0
    ) ??
    product.variants.find((variant) => variant.quantity > 0) ??
    product.variants[0]!;

  return (
    <>
      <Card className="py-2 px-2 border-0 shadow-none flex flex-col ">
        <Carousel>
          <CarouselContent>
            {allImages.map((image) => (
              <CarouselItem key={image}>
                <div className="relative aspect-[3/4] h-[194px] w-full rounded-lg ">
                  <Image
                    src={image}
                    alt={product.name.en}
                    fill
                    className="rounded-lg object-fit"
                    sizes="full"
                  />
                  <ProductBadges
                    product={product}
                    variant={firstAvailableVariant}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <CarouselDots dotClassName="size-2" className="-bottom-4" />
          )}
        </Carousel>

        <CustomLink
          href={`/products/${product._id}?variant=${firstAvailableVariant._id}`}
          className="flex-grow"
        >
          <p
            className={cn(
              "font-bold",
              firstAvailableVariant.compare_at_price && "text-primary"
            )}
          >
            {firstAvailableVariant.price.toLocaleString(locale)}{" "}
            {currency.symbol}
          </p>
          {firstAvailableVariant.compare_at_price && (
            <p className="text-muted-foreground line-through text-xs">
              {firstAvailableVariant.compare_at_price.toLocaleString()}{" "}
              {currency.symbol}
            </p>
          )}

          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {product.name[locale]}
          </p>
        </CustomLink>

        {hasNoVariants ? (
          <Button disabled className="w-full" size="lg">
            <ShoppingCartIcon className="w-4 h-4" />
            {t("no_options_available")}
          </Button>
        ) : (
          <AddToCartButton {...getButtonProps()} />
        )}
      </Card>

      {hasMultipleVariants && (
        <ProductVariantDrawer
          product={product}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
};
