"use client";
import dayjs from "dayjs";
import { ICourierReportDay } from "@repo/api/services/courier/index";

interface IProps {
  days: ICourierReportDay[];
}

export const ReportBarChart = ({ days }: IProps) => {
  const max = Math.max(...days.map((d) => d.earnings), 1);

  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="flex h-52 items-end gap-2"
        style={{ minWidth: `${days.length * 40}px` }}
      >
        {days.map((d) => {
          const pct = (d.earnings / max) * 100;
          const hasValue = d.earnings > 0;
          return (
            <div
              key={d.date}
              className="flex flex-1 flex-col items-center justify-end gap-1"
              style={{ minWidth: 32 }}
            >
              {hasValue && (
                <span className="text-[9px] font-medium text-muted-foreground whitespace-nowrap">
                  {d.earnings.toLocaleString()}
                </span>
              )}
              <div
                className="w-full rounded-t-md bg-primary transition-all"
                style={{ height: `${hasValue ? Math.max(pct, 3) : 0}%` }}
              />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {dayjs(d.date).format("DD.MM")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
