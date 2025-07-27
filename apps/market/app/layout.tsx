import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@repo/contexts/react-query.context";

import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market",
  description: "Market",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html>
      <body suppressHydrationWarning className="antialiased bg-secondary">
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
