import { ICartItem } from "@repo/contexts/cart-context";
import { Card } from "@repo/ui/components/ui/card";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { AddToCartButton } from "@repo/shared-modules/components/add-to-cart-button/add-to-cart-button";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useRef, useState, useEffect } from "react";
import { cn } from "@repo/ui/lib/utils";
import { CustomLink } from "@repo/shared-modules/components/custom-link";
import { Button } from "@repo/ui/components/ui/button";
import { CircleSlash2 } from "@repo/ui/components/icons/index";

const INCREMENT_DEBOUNCE_MS = 600;

interface IProps {
  item: ICartItem;
}

export const CartItem = ({ item }: IProps) => {
  const t = useTranslations("cart");
  const locale = useLocale() as keyof ILocale;
  const { updateQuantity, removeItem, addItem } = useCart();
  const { currency } = useShopContext();

  const availableStock = item.variant?.quantity ?? Infinity;
  const compareAtPrice = item.variant?.compare_at_price;

  // ── Debounced increment ───────────────────────────────────────────────────
  // pendingRef holds the accumulated click count that hasn't been dispatched yet.
  // displayExtra mirrors it as React state so the counter re-renders immediately.
  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [displayExtra, setDisplayExtra] = useState(0);

  // Reset display state if item.quantity is updated externally (e.g. after flush)
  useEffect(() => {
    pendingRef.current = 0;
    setDisplayExtra(0);
  }, [item.quantity]);

  const displayQuantity = item.quantity + displayExtra;

  const flushIncrement = () => {
    const qty = pendingRef.current;
    if (qty <= 0) return;
    pendingRef.current = 0;
    setDisplayExtra(0);
    addItem(item.product, item.variant, qty);
  };

  const handleIncrement = () => {
    if (displayQuantity >= availableStock) return;

    pendingRef.current += 1;
    setDisplayExtra(pendingRef.current);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flushIncrement, INCREMENT_DEBOUNCE_MS);
  };

  // Flush on unmount so pending clicks aren't lost
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      flushIncrement();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecrement = () => {
    // Flush any pending increment first so we decrement the correct quantity
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      flushIncrement();
    }

    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const getVariantDisplayText = () => {
    if (!item.variant?.attributes) return null;
    return Object.entries(item.variant.attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

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
        <CustomLink href={`/products/${item.product._id}`} className="block mb-1">
          <p className="font-medium line-clamp-1">{item.product.name[locale]}</p>
          {item.variant && (
            <p className="text-xs text-gray-600">{getVariantDisplayText()}</p>
          )}
          <p className={cn("text-sm font-medium", compareAtPrice && "text-red-500")}>
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
            onAddToCart={handleIncrement}
            currentQuantity={displayQuantity}
            selectedVariant={item.variant}
            product={item.product}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            disabled={false}
          />
        )}
      </div>
    </Card>
  );
};
