import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import "./globals.css";
import { QueryClientProvider } from "@repo/contexts/react-query.context";
import { ShopProvider } from "@/contexts/shop.context";

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Restaurant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning className="bg-secondary">
        <QueryClientProvider>
          <ShopProvider>{children}</ShopProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
