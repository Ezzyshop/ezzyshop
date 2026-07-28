import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@repo/i18n/routing";
import { Locale } from "@repo/i18n/types";
import { Toaster } from "@repo/ui/components/ui/sonner";
import TMAInitClient from "@/components/tma-init-client";
import { CourierDock } from "@/components/courier-dock";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface IProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: IProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div
      className="max-w-[480px] mx-auto min-h-screen bg-background flex flex-col"
      style={{
        paddingTop:
          "calc(var(--tg-safe-area-inset-top, 0px) + var(--tg-content-safe-area-inset-top, 0px))",
      }}
    >
      <NextIntlClientProvider messages={messages}>
        <TMAInitClient />
        <div className="flex-1 flex flex-col">{children}</div>
        <CourierDock />
        <Toaster richColors position="top-center" />
      </NextIntlClientProvider>
    </div>
  );
}
