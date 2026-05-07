"use client";

import { ICommonParams } from "@/utils/interfaces";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

const formatPrice = (n: number) =>
  n.toLocaleString("en-US").replace(/,/g, " ");

export const CartBar = () => {
  const { shopId, locale } = useParams<ICommonParams>();
  const t = useTranslations("homepage.cart_bar");
  const { totalItems, totalPrice } = useCart();
  const { currency } = useShopContext();

  if (totalItems <= 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom,0px))] z-30 px-4">
      <div className="pointer-events-auto mx-auto max-w-[425px]">
        <Link
          href={`/${locale}/${shopId}/cart`}
          className="flex items-center justify-between rounded-full bg-foreground px-4 py-3.5 text-background shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] active:scale-[0.99] transition-transform animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <span className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground text-[13px] font-bold tabular-nums">
              {totalItems}
            </span>
            <span className="text-[14px] font-semibold">
              {t("go_to_cart")}
            </span>
          </span>
          <span className="text-[14px] font-bold tabular-nums">
            {formatPrice(totalPrice)} {currency.symbol}
          </span>
        </Link>
      </div>
    </div>
  );
};
