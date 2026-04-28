import { ProtectedLink } from "@repo/shared-modules/components/protected-link";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";

export const CartSummary = () => {
  const { totalPrice, totalItems, totalDiscount, trackBeginCheckout } = useCart();
  const { currency } = useShopContext();
  const t = useTranslations("cart");

  const handleCheckoutClick = () => {
    trackBeginCheckout(currency.symbol ?? "UZS");
  };

  return (
    <div className="flex gap-2 px-4 py-3 border-t rounded-t-lg sticky bottom-[57px] bg-background">
      <div className="flex-grow">
        <p className="text-primary font-medium">
          {totalPrice.toLocaleString()} {currency.symbol}
        </p>

        <p className="text-muted-foreground text-sm">
          {totalItems} {t("items")}
          {totalDiscount > 0 && (
            <span className="ml-1 text-green-600">
              (-{totalDiscount.toLocaleString()} {currency.symbol})
            </span>
          )}
        </p>
      </div>

      <ProtectedLink href="/checkout" asChild>
        <Button size="lg" className="w-fit" onClick={handleCheckoutClick}>
          {t("checkout")}
        </Button>
      </ProtectedLink>
    </div>
  );
};
