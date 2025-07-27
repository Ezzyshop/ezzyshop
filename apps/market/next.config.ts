import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./utils/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/i18n", "@repo/api", "@repo/contexts"],
};

export default withNextIntl(nextConfig);
