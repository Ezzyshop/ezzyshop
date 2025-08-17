"use client";
import { useShopContext } from "@/contexts/shop.context";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { Card } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { useLocale } from "next-intl";
import Image from "next/image";
import { ProductCardSmallBadges } from "./product-card-small-badges";
import { CustomLink } from "../custom-link";

interface IProps {
  product: IProductResponse;
}

export const ProductCardSmall = ({ product }: IProps) => {
  const locale = useLocale() as keyof ILocale;
  const { currency } = useShopContext();

  return (
    <CustomLink href={`/products/${product._id}`} className="block w-full">
      <Card className="gap-1 p-2 shadow-none border-none max-w-[130px] w-full h-full">
        <div className="relative">
          <Image
            src={product.images[0] || ""}
            alt={product.name[locale]}
            width={120}
            height={100}
            className="rounded-lg object-fit"
          />
          <ProductCardSmallBadges product={product} />
        </div>
        <div>
          <p className={cn("font-medium text-xs")}>
            {product.price.toLocaleString(locale)} {currency.symbol}
          </p>
          {product.compare_at_price && (
            <p className="text-muted-foreground line-through text-[10px]">
              {product.compare_at_price.toLocaleString()} {currency.symbol}
            </p>
          )}
          <p className="text-xs line-clamp-2 mt-1">{product.name[locale]}</p>
        </div>
      </Card>
    </CustomLink>
  );
};
