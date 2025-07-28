import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./utils/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/i18n"],
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "assets.ezzyshop.uz",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
