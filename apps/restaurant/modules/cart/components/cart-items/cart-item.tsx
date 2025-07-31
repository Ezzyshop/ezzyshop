import { ICartItem } from "@repo/contexts/cart-context";
import { Card } from "@repo/ui/components/ui/card";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { AddToCartButton } from "@/components/add-to-cart-button/add-to-cart-button";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { useShopContext } from "@/contexts/shop.context";
import { useState } from "react";

interface IProps {
  item: ICartItem;
}

export const CartItem = ({ item }: IProps) => {
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

  return (
    <Card className="p-4 flex flex-row items-start shadow-none border-0">
      <div className="relative min-w-24 w-24 h-24">
        <Image
          src={item.variant?.image || item.product.images[0] || ""}
          alt={item.product.name[locale]}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="space-y-1 flex-grow">
        <p className="font-medium line-clamp-1">{item.product.name[locale]}</p>
        {item.variant && (
          <p className="text-xs text-gray-600">{getVariantDisplayText()}</p>
        )}
        <p className="text-sm font-medium">
          {(item.variant?.price || item.product.price).toLocaleString()}{" "}
          {currency.symbol}
        </p>
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
      </div>
    </Card>
  );
};
