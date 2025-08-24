"use client";
import { useEffect } from "react";

import { useParams, usePathname, useRouter } from "next/navigation";
import WebApp from "@twa-dev/sdk";

export const useTMAInit = () => {
  const pathname = usePathname();
  const { shopId, locale } = useParams();
  const isHomePage = pathname === `/${locale}/${shopId}/home`;
  const router = useRouter();

  useEffect(() => {
    if (isHomePage) {
      WebApp.BackButton.hide();
    }
    WebApp.BackButton.onClick(() => {
      router.back();
    });

    WebApp.enableClosingConfirmation();
    WebApp.disableVerticalSwipes();
    WebApp.setHeaderColor("--primary" as `#${string}`);
  }, [isHomePage, router]);
};
