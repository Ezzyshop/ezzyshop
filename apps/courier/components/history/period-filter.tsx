"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { cn } from "@repo/ui/lib/utils";
import { DatePicker } from "../date-picker";

export interface IPeriodRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

type Preset = "today" | "week" | "month" | "custom";

const fmt = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");

export const presetRange = (preset: Exclude<Preset, "custom">): IPeriodRange => {
  const today = dayjs();
  const days = preset === "today" ? 0 : preset === "week" ? 6 : 29;
  return { from: fmt(today.subtract(days, "day")), to: fmt(today) };
};

interface IProps {
  value: IPeriodRange;
  onChange: (range: IPeriodRange) => void;
}

export const PeriodFilter = ({ value, onChange }: IProps) => {
  const t = useTranslations("courier");
  const [preset, setPreset] = useState<Preset>("week");

  const today = fmt(dayjs());
  const presets: Exclude<Preset, "custom">[] = ["today", "week", "month"];

  const selectPreset = (next: Preset) => {
    setPreset(next);
    if (next !== "custom") onChange(presetRange(next));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-0.5">
        {[...presets, "custom" as const].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectPreset(key)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              preset === key
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-muted-foreground"
            )}
          >
            {t(`history.period.${key}`)}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-end gap-2">
          <DatePicker
            label={t("history.from")}
            value={value.from}
            max={value.to}
            onChange={(from) => onChange({ ...value, from })}
          />
          <DatePicker
            label={t("history.to")}
            value={value.to}
            min={value.from}
            max={today}
            onChange={(to) => onChange({ ...value, to })}
          />
        </div>
      )}
    </div>
  );
};
