import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";

import "./globals.css";
import { QueryClientProvider } from "@repo/contexts/react-query.context";
import { ShopProvider } from "@/contexts/shop.context";
import NextTopLoader from "nextjs-toploader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

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
        <NextTopLoader
          color="var(--primary)"
          height={3}
          showSpinner={false}
          crawlSpeed={200}
        />
      </body>
    </html>
  );
}
