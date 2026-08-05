"use client";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Home, ClipboardList, History, UserRound } from "lucide-react";
import { CourierService } from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";

export const CourierDock = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { isCourier } = useCourierContext();
  const path = router.pathname;

  const { data } = useQuery({
    queryKey: ["courier-active-orders"],
    queryFn: () => CourierService.getActiveOrders(),
    enabled: isCourier,
  });
  const activeCount = data?.data?.length ?? 0;

  // Hidden on the login screen and until the courier is authenticated
  if (!isCourier || path.startsWith("/login")) return null;

  const isHistoryTab = path.startsWith("/history");
  // Debts are reached from the profile tab, so they keep it highlighted
  const isProfileTab = path.startsWith("/profile") || path.startsWith("/debts");
  const isActiveTab =
    !isHistoryTab &&
    !isProfileTab &&
    (path.startsWith("/active") || path.startsWith("/orders"));
  const isHomeTab = !isActiveTab && !isHistoryTab && !isProfileTab;

  const items = [
    {
      key: "home",
      label: t("dock.main"),
      icon: Home,
      active: isHomeTab,
      badge: 0,
      onClick: () => router.push("/"),
    },
    {
      key: "active",
      label: t("dock.active"),
      icon: ClipboardList,
      active: isActiveTab,
      badge: activeCount,
      onClick: () => router.push("/active"),
    },
    {
      key: "history",
      label: t("dock.history"),
      icon: History,
      active: isHistoryTab,
      badge: 0,
      onClick: () => router.push("/history"),
    },
    {
      key: "profile",
      label: t("dock.profile"),
      icon: UserRound,
      active: isProfileTab,
      badge: 0,
      onClick: () => router.push("/profile"),
    },
  ];

  return (
    <nav
      className="sticky bottom-0 z-20 grid grid-cols-4 border-t bg-background/95 backdrop-blur"
      style={{
        paddingBottom:
          "calc(var(--tg-safe-area-inset-bottom, 0px) + 0.25rem)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs ${
            item.active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div className="relative">
            <item.icon className="size-5" />
            {item.badge > 0 && (
              <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                {item.badge}
              </span>
            )}
          </div>
          {item.label}
        </button>
      ))}
    </nav>
  );
};
