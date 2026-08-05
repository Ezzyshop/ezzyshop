"use client";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useI18nRouter } from "@repo/i18n/hooks";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import {
  Banknote,
  CalendarDays,
  ChevronRight,
  CreditCard,
  PackageCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { ICourierStats } from "@repo/api/services/courier/index";

interface IProps {
  stats: ICourierStats;
}

export const StatsOverview = ({ stats }: IProps) => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { totals, currency_symbol: currency, debts } = stats;

  const money = (value: number) => `${value.toLocaleString()} ${currency}`;

  const kpis = [
    {
      key: "earnings",
      label: t("stats.earnings"),
      value: money(totals.earnings),
      icon: Wallet,
      accent: "text-primary",
    },
    {
      key: "orders",
      label: t("stats.orders"),
      value: String(totals.orders),
      icon: PackageCheck,
      accent: "text-foreground",
    },
    {
      key: "cash",
      label: t("stats.cash"),
      value: money(totals.cash_earnings),
      icon: Banknote,
      accent: "text-green-600",
    },
    {
      key: "online",
      label: t("stats.online"),
      value: money(totals.online_earnings),
      icon: CreditCard,
      accent: "text-orange-500",
    },
  ];

  const rows = [
    { label: t("stats.avg_per_day"), value: money(totals.avg_per_active_day) },
    { label: t("stats.avg_per_order"), value: money(totals.avg_per_order) },
    {
      label: t("stats.best_day"),
      value: totals.best_day
        ? `${dayjs(totals.best_day.date).format("DD.MM")} · ${money(totals.best_day.earnings)}`
        : t("stats.no_data"),
    },
    { label: t("stats.active_days"), value: String(totals.active_days) },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.key} className="py-3">
            <CardContent className="flex items-center gap-2 px-3">
              <kpi.icon className={`size-5 shrink-0 ${kpi.accent}`} />
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                <p className={`truncate text-sm font-bold ${kpi.accent}`}>
                  {kpi.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totals.online_earnings > 0 && (
        <p className="px-1 text-[11px] text-muted-foreground">
          {t("stats.online_hint")}
        </p>
      )}

      {debts.total_balance > 0 && (
        <button
          type="button"
          onClick={() => router.push("/debts")}
          className="flex w-full items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-left active:scale-[0.99] transition-transform"
        >
          <Wallet className="size-5 shrink-0 text-orange-500" />
          <div className="flex-1 leading-tight">
            <p className="text-[11px] text-orange-700/80">
              {t("stats.debt_total")}
            </p>
            <p className="text-sm font-bold text-orange-600">
              {money(debts.total_balance)}
            </p>
          </div>
          <ChevronRight className="size-4 text-orange-500" />
        </button>
      )}

      <Card className="py-3">
        <CardContent className="space-y-2 px-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <TrendingUp className="size-4" />
            {t("stats.averages_title")}
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-semibold">{row.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
        <CalendarDays className="size-3.5" />
        {dayjs(stats.from).format("DD.MM.YYYY")} —{" "}
        {dayjs(stats.to).format("DD.MM.YYYY")}
      </p>
    </div>
  );
};
