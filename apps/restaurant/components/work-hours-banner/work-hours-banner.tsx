"use client";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { IWorkHourDay } from "@repo/api/services/shop/shop.interface";
import { useTranslations } from "next-intl";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const UZBEKISTAN_OFFSET_MS = 5 * 60 * 60 * 1000;

function getCurrentUzbekistanDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + UZBEKISTAN_OFFSET_MS);
}

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h!) || isNaN(m!)) return 0;
  return h! * 60 + m!;
}

function getShopStatus(day: IWorkHourDay | undefined): {
  isOpen: boolean;
  open: string;
  close: string;
  isClosedAllDay: boolean;
} {
  if (!day) return { isOpen: true, open: "", close: "", isClosedAllDay: false };

  if (!day.is_open) {
    return {
      isOpen: false,
      open: day.open,
      close: day.close,
      isClosedAllDay: true,
    };
  }

  const uzbekDate = getCurrentUzbekistanDate();
  const currentMinutes =
    uzbekDate.getUTCHours() * 60 + uzbekDate.getUTCMinutes();
  const openMinutes = parseMinutes(day.open);
  const closeMinutes = parseMinutes(day.close);
  const overnight = closeMinutes <= openMinutes;
  const isOpen = overnight
    ? currentMinutes >= openMinutes || currentMinutes < closeMinutes
    : currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return { isOpen, open: day.open, close: day.close, isClosedAllDay: false };
}

export const WorkHoursBanner = () => {
  const shop = useShopContext();
  const t = useTranslations("work_hours");

  if (!shop.work_hours) return null;

  const uzbekDate = getCurrentUzbekistanDate();
  const dayName = DAYS[uzbekDate.getUTCDay()]!;
  const todayHours = shop.work_hours[dayName];
  const { isOpen, open, close, isClosedAllDay } = getShopStatus(todayHours);

  if (isOpen) return null;

  return (
    <div className="w-full bg-amber-500 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium">
      <span>🕐</span>
      <span>{t("closed_title")}</span>
      {!isClosedAllDay && (
        <span className="opacity-80">
          · {t("closed_description", { open, close })}
        </span>
      )}
      {isClosedAllDay && (
        <span className="opacity-80">· {t("closed_all_day")}</span>
      )}
    </div>
  );
};
