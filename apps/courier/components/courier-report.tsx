"use client";
import { useEffect, useState } from "react";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Wallet, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { CourierService } from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";
import { ReportBarChart } from "./report-bar-chart";
import { DatePicker } from "./date-picker";

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export const CourierReport = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { isLoading: isProfileLoading, isCourier } = useCourierContext();

  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const [from, setFrom] = useState(fmt(weekAgo));
  const [to, setTo] = useState(fmt(today));

  useEffect(() => {
    if (!isProfileLoading && !isCourier) {
      router.replace("/login");
    }
  }, [isProfileLoading, isCourier, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["courier-report", from, to],
    queryFn: () => CourierService.getReport(from, to),
    enabled: isCourier && Boolean(from && to),
  });

  const report = data?.data;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <p className="font-semibold">{t("dock.report")}</p>
      </header>

      <div className="flex-1 space-y-4 p-4">
        {/* Date range filter */}
        <div className="flex items-end gap-2">
          <DatePicker
            label={t("report.from")}
            value={from}
            max={to}
            onChange={setFrom}
          />
          <DatePicker
            label={t("report.to")}
            value={to}
            min={from}
            max={fmt(today)}
            onChange={setTo}
          />
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="py-3">
            <CardContent className="flex items-center gap-2">
              <Wallet className="size-5 text-primary" />
              <div className="leading-tight">
                <p className="text-[10px] text-muted-foreground">
                  {t("report.total")}
                </p>
                <p className="text-sm font-bold text-primary">
                  {(report?.total_earnings ?? 0).toLocaleString()}{" "}
                  {report?.currency_symbol ?? ""}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-2">
              <PackageCheck className="size-5 text-primary" />
              <div className="leading-tight">
                <p className="text-[10px] text-muted-foreground">
                  {t("report.orders")}
                </p>
                <p className="text-sm font-bold">{report?.total_count ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="py-4">
          <CardContent>
            {isLoading || isProfileLoading ? (
              <div className="flex h-52 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : report && report.days.length > 0 ? (
              <ReportBarChart days={report.days} />
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                {t("report.empty")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
