import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@repo/i18n/routing";
import { Locale } from "@repo/i18n/types";
import { CartProvider } from "@repo/contexts/cart-context/cart.context";
import { UserProvider } from "@repo/contexts/user-context/user.context";
import { CouponProvider } from "@repo/contexts/coupon-context/coupon.context";
import { WishlistProvider } from "@repo/contexts/wishlist-context/wishlist.context";
import { ViewedProductsProvider } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { Dock } from "@repo/shared-modules/components/dock/dock";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { ICommonParams } from "@/utils/interfaces";
import TMAInitClient from "@/components/tma-init-client";
import { QueryClientProvider } from "@repo/contexts/react-query.context";
import { ShopProvider } from "@repo/contexts/shop-context/shop.context";

interface IProps {
  children: React.ReactNode;
  params: Promise<ICommonParams>;
}

export default async function Layout({ children, params }: IProps) {
  const { locale, shopId } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryClientProvider>
        <ShopProvider>
          <TMAInitClient />
          <UserProvider>
            <CartProvider shopId={`${shopId}-restaurant`}>
              <CouponProvider shopId={`${shopId}-restaurant`}>
                <WishlistProvider shopId={`${shopId}-restaurant`}>
                  <ViewedProductsProvider shopId={`${shopId}-restaurant`}>
                    <div className="flex-1 flex flex-col">{children}</div>
                    <Dock />
                    <Toaster richColors position="top-center" />
                  </ViewedProductsProvider>
                </WishlistProvider>
              </CouponProvider>
            </CartProvider>
          </UserProvider>
        </ShopProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
