import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@repo/contexts/react-query.context";
import { Metadata } from "next";

import "./globals.css";

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
