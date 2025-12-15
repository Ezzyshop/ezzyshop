"use client";
import { useEffect } from "react";

import { useParams, usePathname, useRouter } from "next/navigation";
import WebApp from "@twa-dev/sdk";
// import { useShopContext } from "@/contexts/shop.context";

export const useTMAInit = () => {
  const pathname = usePathname();
  const { shopId, locale } = useParams();
  const isHomePage = pathname === `/${locale}/${shopId}/home`;
  const router = useRouter();
  // const { brand_color } = useShopContext();

  useEffect(() => {
    if (isHomePage) {
      WebApp.BackButton.hide();
    }
    WebApp.BackButton.onClick(() => {
      router.back();
    });
  }, [isHomePage, router]);

  // useEffect(() => {
  //   WebApp.setHeaderColor((brand_color as `#${string}`) ?? "#000000");
  // }, [brand_color]);

  useEffect(() => {
    WebApp.enableClosingConfirmation();
    WebApp.disableVerticalSwipes();
  }, []);
};
