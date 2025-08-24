import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@repo/i18n/routing";
import { Locale } from "@repo/i18n/types";
import { Dock } from "@/components/dock/dock";
import { CartProvider } from "@repo/contexts/cart-context/cart.context";
import { WishlistProvider } from "@repo/contexts/wishlist-context/wishlist.context";
import { ViewedProductsProvider } from "@repo/contexts/viewed-products-context/viewed-products.context";
import { UserProvider } from "@repo/contexts/user-context/user.context";
import { Toaster } from "@repo/ui/components/ui/sonner";

interface IProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: IProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div className="max-w-[425px] mx-auto min-h-screen bg-background flex flex-col">
      <NextIntlClientProvider messages={messages}>
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <ViewedProductsProvider>
                <div className="flex-1 flex flex-col">{children}</div>
                <Dock />
                <Toaster richColors position="top-center" />
              </ViewedProductsProvider>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </NextIntlClientProvider>
    </div>
  );
}
