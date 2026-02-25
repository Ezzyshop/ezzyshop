import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "market",
  description: "market",
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
        <div className="max-w-[425px] mx-auto min-h-screen bg-background flex flex-col">
          {children}
          <NextTopLoader
            color="var(--primary)"
            height={3}
            showSpinner={false}
            crawlSpeed={200}
          />
        </div>
      </body>
    </html>
  );
}
