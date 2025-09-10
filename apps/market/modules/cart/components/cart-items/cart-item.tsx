import { ICartItem } from "@repo/contexts/cart-context";
import { Card } from "@repo/ui/components/ui/card";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { AddToCartButton } from "@/components/add-to-cart-button/add-to-cart-button";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { useShopContext } from "@/contexts/shop.context";
import { useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { CustomLink } from "@/components/custom-link";
import { Button } from "@repo/ui/components/ui/button";
import { CircleSlash2 } from "@repo/ui/components/icons/index";

interface IProps {
  item: ICartItem;
}

export const CartItem = ({ item }: IProps) => {
  const t = useTranslations("cart");
  const locale = useLocale() as keyof ILocale;
  const { updateQuantity, removeItem, addItem } = useCart();
  const { currency } = useShopContext();
  const [isLoading, setIsLoading] = useState(false);

  const availableStock = item.variant?.quantity ?? Infinity;

  const handleIncrement = async () => {
    try {
      setIsLoading(true);

      if (item.quantity >= availableStock) {
        return;
      }

      addItem(item.product, item.variant, 1);
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    try {
      setIsLoading(true);

      if (item.quantity <= 1) {
        removeItem(item.id);
      } else {
        updateQuantity(item.id, item.quantity - 1);
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    handleIncrement();
  };

  const getVariantDisplayText = () => {
    if (!item.variant || !item.variant.attributes) return null;

    return Object.entries(item.variant.attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  const compareAtPrice = item.variant?.compare_at_price;

  return (
    <Card className="p-4 flex flex-row items-start shadow-none border-0">
      <div className="relative min-w-24 w-24 h-24">
        <Image
          src={item.variant?.images[0] ?? item.product.main_image ?? ""}
          alt={item.product.name[locale]}
          fill
          className="rounded-lg object-cover"
          sizes="full"
        />
        {item.isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
            <CircleSlash2 className="text-white" />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <CustomLink
          href={`/products/${item.product._id}`}
          className="block mb-1"
        >
          <p className="font-medium line-clamp-1">
            {item.product.name[locale]}
          </p>
          {item.variant && (
            <p className="text-xs text-gray-600">{getVariantDisplayText()}</p>
          )}
          <p
            className={cn(
              "text-sm font-medium",
              compareAtPrice && "text-red-500"
            )}
          >
            {item.variant?.price.toLocaleString()} {currency.symbol}
          </p>

          {compareAtPrice && (
            <p className="text-xs text-gray-600 line-through">
              {compareAtPrice.toLocaleString()} {currency.symbol}
            </p>
          )}
        </CustomLink>

        {item.isOutOfStock ? (
          <>
            <p className="text-sm text-destructive">{t("out_of_stock")}</p>
            <Button
              onClick={() => removeItem(item.id)}
              variant="destructive"
              size="sm"
              className="w-full mt-1"
            >
              {t("remove")}
            </Button>
          </>
        ) : (
          <AddToCartButton
            size="sm"
            onAddToCart={handleAddToCart}
            currentQuantity={item.quantity}
            selectedVariant={item.variant}
            product={item.product}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            disabled={isLoading}
          />
        )}
      </div>
    </Card>
  );
};
