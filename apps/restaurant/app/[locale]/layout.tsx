import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@repo/i18n/routing";
import { Locale } from "@repo/i18n/types";
import { Dock } from "@/components/dock/dock";

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
        <div className="flex-1">{children}</div>
        <Dock />
      </NextIntlClientProvider>
    </div>
  );
}
