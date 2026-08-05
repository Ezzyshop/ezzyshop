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
      <div className="flex h-52 gap-2" style={{ minWidth: `${days.length * 40}px` }}>
        {days.map((d) => {
          const hasValue = d.earnings > 0;
          const pct = Math.max((d.earnings / max) * 100, hasValue ? 3 : 0);
          return (
            <div
              key={d.date}
              className="flex flex-1 flex-col items-center gap-1"
              style={{ minWidth: 32 }}
            >
              <span className="h-3.5 text-[9px] font-medium whitespace-nowrap text-muted-foreground">
                {hasValue ? d.earnings.toLocaleString() : ""}
              </span>
              {/* Relative track so the bar's percentage height has a definite parent */}
              <div className="relative w-full flex-1">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-md bg-primary transition-all"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                {dayjs(d.date).format("DD.MM")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
