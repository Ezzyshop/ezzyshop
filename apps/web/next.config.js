import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./utils/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/i18n"],
};

export default withNextIntl(nextConfig);
