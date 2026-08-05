"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Clock, Timer } from "lucide-react";
import { ICourierStatsTiming } from "@repo/api/services/courier/index";
import { formatDuration } from "@/utils/format";

interface IProps {
  timing: ICourierStatsTiming;
}

export const StatsTiming = ({ timing }: IProps) => {
  const t = useTranslations("courier");

  const units = {
    sec: t("stats.sec"),
    min: t("stats.min"),
    hour: t("stats.hour"),
    day: t("stats.day"),
  };

  const rated = timing.on_time_count + timing.late_count;
  const hasAnything =
    timing.avg_accept_seconds !== null ||
    timing.avg_delivery_seconds !== null ||
    rated > 0;

  // Nothing to show for old orders that predate ETA/timestamp tracking
  if (!hasAnything) return null;

  const rows = [
    {
      label: t("stats.avg_accept"),
      value: formatDuration(timing.avg_accept_seconds, units),
    },
    {
      label: t("stats.avg_delivery"),
      value: formatDuration(timing.avg_delivery_seconds, units),
    },
  ].filter((row) => row.value !== null);

  return (
    <Card className="py-3">
      <CardContent className="space-y-3 px-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Clock className="size-4" />
          {t("stats.timing_title")}
        </div>

        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Timer className="size-3.5 text-muted-foreground" />
              {row.value}
            </span>
          </div>
        ))}

        {timing.on_time_rate !== null && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{t("stats.on_time")}</span>
              <span className="font-semibold">
                {timing.on_time_rate}%{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  ({timing.on_time_count}/{rated})
                </span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={
                  timing.on_time_rate >= 80
                    ? "h-full rounded-full bg-green-500"
                    : timing.on_time_rate >= 50
                      ? "h-full rounded-full bg-orange-400"
                      : "h-full rounded-full bg-destructive"
                }
                style={{ width: `${timing.on_time_rate}%` }}
              />
            </div>
            {timing.late_count > 0 && (
              <p className="text-[11px] text-muted-foreground">
                {t("stats.late")}: {timing.late_count}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
