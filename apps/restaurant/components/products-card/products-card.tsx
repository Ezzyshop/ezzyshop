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

interface IProps {
  product: IProductResponse;
}

export const ProductsCard = ({ product }: IProps) => {
  const locale = useLocale();
  const t = useTranslations("product");
  const { currency } = useShopContext();
  return (
    <Card className="py-2 px-2 border-0 shadow-none flex flex-col ">
      <Carousel>
        <CarouselContent>
          {product.images.map((image) => (
            <CarouselItem key={image}>
              <div className="relative aspect-[3/4] h-[194px] w-full rounded-lg">
                <Image
                  src={image}
                  alt={product.name.en}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots dotClassName="size-2" className="-bottom-4" />
      </Carousel>

      <div className="flex-grow">
        <p
          className={cn(
            "font-bold",
            product.compare_at_price && "text-primary"
          )}
        >
          {product.compare_at_price?.toLocaleString(locale) ??
            product.price.toLocaleString(locale)}{" "}
          {currency.symbol}
        </p>
        {product.compare_at_price && (
          <p className="text-muted-foreground line-through text-xs">
            {product.price.toLocaleString()} {currency.symbol}
          </p>
        )}

        <p className="text-muted-foreground text-sm mt-1">
          {product.name[locale]}
        </p>
      </div>

      <Button className="w-full">
        <ShoppingCartIcon className="size-4" /> {t("add_to_cart")}
      </Button>
    </Card>
  );
};
