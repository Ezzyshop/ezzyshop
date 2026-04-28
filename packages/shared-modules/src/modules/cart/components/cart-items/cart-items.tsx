import { useCart } from "@repo/contexts/cart-context/cart.context";
import { CartItem } from "./cart-item";
import { useTranslations } from "next-intl";
import { Package } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { CustomLink } from "@repo/shared-modules/components/custom-link";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useEffect } from "react";

export const CartItems = () => {
  const { items, trackViewCart } = useCart();
  const { currency } = useShopContext();
  const t = useTranslations("cart.empty");

  useEffect(() => {
    if (items.length > 0) {
      trackViewCart(currency.symbol ?? "UZS");
    }
    // Fire once on mount — items.length used only as a guard
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh]">
        <Package className="w-24 h-24 opacity-50" />
        <p className="text-center mt-4">{t("title")}</p>
        <p className="text-muted-foreground text-sm text-center mt-1">
          {t("description")}
        </p>
        <Button className="mt-4" asChild>
          <CustomLink href="/home">{t("go_to_home")}</CustomLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};
