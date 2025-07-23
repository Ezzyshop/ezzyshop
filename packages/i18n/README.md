# @repo/i18n

A reusable internationalization (i18n) package for Next.js applications using the App Router, built for Turborepo monorepos.

## Features

- 🌍 **Multi-language support**: English, Spanish, French, German, and Chinese
- 🚀 **Next.js App Router optimized**: Built specifically for Next.js 13+ App Router
- 🔧 **TypeScript support**: Full type safety for translations
- 🎨 **Reusable components**: Pre-built language switcher components
- 🎯 **Custom hooks**: Easy-to-use hooks for common i18n operations
- ⚡ **Server-side rendering**: Full SSR support with next-intl
- 🔗 **Automatic routing**: Locale-based URL routing (/en, /es, etc.)

## Installation

1. Add the package to your Next.js app:

```bash
pnpm add @repo/i18n next-intl
```

2. Update your `next.config.js`:

```javascript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/i18n"],
};

export default withNextIntl(nextConfig);
```

3. Create `src/i18n.ts` in your app:

```typescript
import config from "@repo/i18n/config";
export default config;
```

4. Create `middleware.ts` in your app root:

```typescript
export { default, config } from "@repo/i18n/middleware";
```

5. Restructure your app to use locale routing:
   - Move your existing `app/page.tsx` to `app/[locale]/page.tsx`
   - Create `app/[locale]/layout.tsx` (see setup below)

## Setup

### App Layout Structure

Your app should have this structure:

```
app/
├── [locale]/
│   ├── layout.tsx    # Locale-specific layout
│   ├── page.tsx      # Your pages
│   └── ...
├── layout.tsx        # Root layout
├── globals.css
└── ...
```

### Root Layout (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import localFont from "next/font/local";
import "./globals.css";

// ... your fonts

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={geistSans.variable}>{children}</body>
    </html>
  );
}
```

### Locale Layout (`app/[locale]/layout.tsx`)

```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@repo/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

## Usage

### Using Translations in Components

```tsx
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("messages.welcome")}</h1>
      <p>{t("common.loading")}</p>
      <button>{t("common.save")}</button>
    </div>
  );
}
```

### Language Switcher Component

```tsx
import { LanguageSwitcher } from "@repo/i18n/components";

export default function Header() {
  return (
    <header>
      <nav>
        {/* Dropdown variant */}
        <LanguageSwitcher variant="dropdown" />

        {/* Button variant */}
        <LanguageSwitcher variant="buttons" showFlag={true} showName={true} />
      </nav>
    </header>
  );
}
```

### Using the i18n Router Hook

```tsx
import { useI18nRouter } from "@repo/i18n/hooks";

export default function MyComponent() {
  const { push, switchLocale, locale } = useI18nRouter();

  const handleNavigation = () => {
    // Navigate to a localized route
    push("/about");
  };

  const handleLanguageSwitch = () => {
    // Switch language while staying on the same page
    switchLocale("es");
  };

  return (
    <div>
      <p>Current locale: {locale}</p>
      <button onClick={handleNavigation}>Go to About</button>
      <button onClick={handleLanguageSwitch}>Switch to Spanish</button>
    </div>
  );
}
```

## Available Translations

The package comes with pre-built translations for common UI elements:

### Common

- `common.loading` - Loading states
- `common.error` - Error messages
- `common.save`, `common.cancel`, `common.delete` - Action buttons
- `common.search`, `common.close`, `common.open` - UI actions
- `common.yes`, `common.no` - Confirmations

### Navigation

- `navigation.home`, `navigation.about` - Menu items
- `navigation.contact`, `navigation.services`, `navigation.products`

### Language

- `language.switchLanguage` - Language switcher labels
- `language.currentLanguage` - Current language display
- `language.selectLanguage` - Selection prompts

### Messages

- `messages.welcome` - Welcome messages
- `messages.thankYou` - Thank you messages
- `messages.comingSoon` - Coming soon placeholders

## Supported Languages

| Code | Language | Flag |
| ---- | -------- | ---- |
| `en` | English  | 🇺🇸   |
| `es` | Español  | 🇪🇸   |
| `fr` | Français | 🇫🇷   |
| `de` | Deutsch  | 🇩🇪   |
| `zh` | 中文     | 🇨🇳   |

## Adding Custom Translations

1. **Add to translation files**: Update the JSON files in `packages/i18n/messages/`

```json
// packages/i18n/messages/en.json
{
  "myModule": {
    "title": "My Module Title",
    "description": "This is my module"
  }
}
```

2. **Use in your components**:

```tsx
const t = useTranslations("myModule");
return <h1>{t("title")}</h1>;
```

## Adding New Languages

1. **Update the routing config** (`packages/i18n/src/routing.ts`):

```typescript
export const routing = defineRouting({
  locales: ["en", "es", "fr", "de", "zh", "ja"], // Add 'ja'
  defaultLocale: "en",
  // ...
});
```

2. **Add locale config** (`packages/i18n/src/utils/index.ts`):

```typescript
export const localeConfigs: LocaleConfig[] = [
  // ... existing configs
  {
    code: "ja",
    name: "日本語",
    flag: "🇯🇵",
  },
];
```

3. **Create translation file** (`packages/i18n/messages/ja.json`):

```json
{
  "common": {
    "loading": "読み込み中..."
    // ... other translations
  }
}
```

4. **Update TypeScript types** (`packages/i18n/src/types/index.ts`):

```typescript
export type Locale = "en" | "es" | "fr" | "de" | "zh" | "ja";
```

## API Reference

### Components

#### `LanguageSwitcher`

Props:

- `className?: string` - Additional CSS classes
- `showFlag?: boolean` - Show country flags (default: true)
- `showName?: boolean` - Show language names (default: true)
- `variant?: 'dropdown' | 'buttons'` - Display variant (default: 'dropdown')

#### `LanguageDropdown`

Props: Same as `LanguageSwitcher` except `variant` (always dropdown)

### Hooks

#### `useI18nRouter()`

Returns:

- `push(href, options?)` - Navigate to localized route
- `replace(href, options?)` - Replace current route with localized route
- `switchLocale(locale)` - Switch language on current page
- `locale` - Current locale
- `pathname` - Current pathname without locale prefix
- `locales` - Available locales
- `defaultLocale` - Default locale

#### `useClientLocale()`

Returns:

- `locale` - Current locale
- `isRTL` - Whether current locale is right-to-left

### Utilities

#### `getLocaleConfig(locale)`

Get configuration for a specific locale.

#### `isValidLocale(locale)`

Check if a locale is supported.

#### `getLocaleName(locale)`

Get display name for a locale.

#### `getLocaleFlag(locale)`

Get flag emoji for a locale.

#### `formatLocaleForDisplay(locale, options)`

Format locale for display with optional flag and name.

## Troubleshooting

### Common Issues

1. **Middleware not working**: Ensure `middleware.ts` is in the app root directory
2. **Translations not loading**: Check that message files exist in `packages/i18n/messages/`
3. **TypeScript errors**: Make sure you're using the correct locale type from `@repo/i18n/types`
4. **Build errors**: Ensure `transpilePackages` includes `@repo/i18n` in your Next.js config

### Development Tips

- Use the browser's network tab to verify translation files are loading
- Check the Next.js server logs for i18n-related errors
- Use React DevTools to inspect the `NextIntlClientProvider` context

## License

This package is part of your monorepo and follows the same license as your project.
