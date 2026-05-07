"use client";

import { HomepageLayout } from "@repo/api/services/shop/shop.enum";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { ClassicHome } from "./classic-home";
import { EditorialHome } from "./editorial-home";

export default function HomePage() {
  const shop = useShopContext();
  const layout = shop.homepage_layout ?? HomepageLayout.Classic;

  if (layout === HomepageLayout.Editorial) {
    return <EditorialHome />;
  }
  return <ClassicHome />;
}
