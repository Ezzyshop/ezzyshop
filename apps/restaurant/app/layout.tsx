import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Rubik } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
});

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
      <body
        suppressHydrationWarning
        className={`${rubik.variable} bg-secondary`}
      >
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
