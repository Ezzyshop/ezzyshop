"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, History } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { CourierService } from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";
import { HistoryOrderCard } from "../history-order-card";
import { IPeriodRange } from "./period-filter";

interface IProps {
  range: IPeriodRange;
}

export const HistoryList = ({ range }: IProps) => {
  const t = useTranslations("courier");
  const { profile, isCourier } = useCourierContext();
  const [shopId, setShopId] = useState<string | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["courier-history", range.from, range.to, shopId],
      queryFn: ({ pageParam }) =>
        CourierService.getHistory({
          from: range.from,
          to: range.to,
          shopId: shopId ?? undefined,
          page: pageParam,
          limit: 20,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.paginationInfo.hasNextPage
          ? lastPage.paginationInfo.currentPage + 1
          : undefined,
      initialPageParam: 1,
      enabled: isCourier,
    });

  const orders = data?.pages.flatMap((page) => page.data) ?? [];
  const shops = profile?.shops ?? [];

  return (
    <div className="space-y-3">
      {shops.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setShopId(null)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              shopId === null
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-muted-foreground"
            )}
          >
            {t("history.all_shops")}
          </button>
          {shops.map((shop) => (
            <button
              key={shop._id}
              type="button"
              onClick={() => setShopId(shop._id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                shopId === shop._id
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-muted-foreground"
              )}
            >
              {shop.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center pt-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 pt-16 text-center text-muted-foreground">
          <History className="size-10" />
          <p>{t("history.empty")}</p>
        </div>
      ) : (
        <>
          {orders.map((order) => (
            <HistoryOrderCard key={order.orderId} order={order} />
          ))}

          {hasNextPage && (
            <Button
              variant="outline"
              className="w-full"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {t("history.load_more")}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
