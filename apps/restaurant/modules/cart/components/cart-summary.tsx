import { ProtectedLink } from "@/components/protected-link";
import { useShopContext } from "@/contexts/shop.context";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";

export const CartSummary = () => {
  const { totalPrice, totalItems } = useCart();
  const { currency } = useShopContext();
  const t = useTranslations("cart");

  return (
    <div className="flex gap-2 px-4 py-3 border-t rounded-t-lg sticky bottom-[57px] bg-background">
      <div className="flex-grow">
        <p className="text-primary font-medium">
          {totalPrice.toLocaleString()} {currency.symbol}
        </p>

        <p className="text-muted-foreground text-sm">
          {totalItems} {t("items")}
        </p>
      </div>

      <ProtectedLink href="/checkout" asChild>
        <Button size="lg">{t("checkout")}</Button>
      </ProtectedLink>
    </div>
  );
};
