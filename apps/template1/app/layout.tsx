import "./globals.css";
import { QueryClientProvider } from "@repo/contexts/react-query.context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased container mx-auto px-4`}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
