"use client";
import { useEffect, useState } from "react";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { CourierService } from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";
import { CourierEarnings } from "./courier-earnings";
import { ReportBarChart } from "./report-bar-chart";
import { PeriodFilter, presetRange } from "./history/period-filter";
import { StatsOverview } from "./history/stats-overview";
import { StatsTiming } from "./history/stats-timing";
import { StatsDiscipline } from "./history/stats-discipline";
import { StatsShops } from "./history/stats-shops";
import { HistoryList } from "./history/history-list";

export const CourierHistory = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { isLoading: isProfileLoading, isCourier } = useCourierContext();
  const [range, setRange] = useState(presetRange("week"));

  useEffect(() => {
    if (!isProfileLoading && !isCourier) {
      router.replace("/login");
    }
  }, [isProfileLoading, isCourier, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["courier-stats", range.from, range.to],
    queryFn: () => CourierService.getStats(range.from, range.to),
    enabled: isCourier && Boolean(range.from && range.to),
  });

  const stats = data?.data;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <p className="font-semibold">{t("history.title")}</p>
        <CourierEarnings />
      </header>

      <div className="flex-1 space-y-3 p-4 pb-24">
        <PeriodFilter value={range} onChange={setRange} />

        <Tabs defaultValue="stats" className="gap-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">{t("history.tab_stats")}</TabsTrigger>
            <TabsTrigger value="orders">{t("history.tab_orders")}</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-3">
            {isLoading || isProfileLoading ? (
              <div className="flex justify-center pt-10">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : !stats ? (
              <p className="pt-10 text-center text-sm text-muted-foreground">
                {t("stats.chart_empty")}
              </p>
            ) : (
              <>
                <StatsOverview stats={stats} />

                <Card className="py-4">
                  <CardContent className="px-3">
                    {stats.totals.orders > 0 ? (
                      <ReportBarChart days={stats.days} />
                    ) : (
                      <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                        {t("stats.chart_empty")}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <StatsTiming timing={stats.timing} />
                <StatsShops
                  shops={stats.shops}
                  currency={stats.currency_symbol}
                />
                <StatsDiscipline />
              </>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <HistoryList range={range} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
