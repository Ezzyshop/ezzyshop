"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useCourierContext } from "@/contexts/courier.context";

const MAX_PENALTIES = 3;

export const StatsDiscipline = () => {
  const t = useTranslations("courier");
  const { profile } = useCourierContext();

  if (!profile) return null;

  const penalties = profile.penalty_count ?? 0;
  const blocks = profile.block_count ?? 0;
  const isBlocked =
    !!profile.blocked_until && new Date(profile.blocked_until) > new Date();
  const isClean = penalties === 0 && blocks === 0 && !isBlocked;

  return (
    <Card className="py-3">
      <CardContent className="space-y-3 px-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {isClean ? (
            <ShieldCheck className="size-4 text-green-600" />
          ) : (
            <ShieldAlert className="size-4 text-orange-500" />
          )}
          {t("stats.discipline_title")}
        </div>

        {isBlocked && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <ShieldAlert className="size-4 shrink-0" />
            <span>
              {t("blocked_until", {
                date: new Date(profile.blocked_until!).toLocaleString(),
              })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">{t("stats.warnings")}</span>
          <span
            className={
              penalties > 0 ? "font-semibold text-orange-500" : "font-semibold"
            }
          >
            {penalties}/{MAX_PENALTIES}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">{t("stats.blocks")}</span>
          <span
            className={
              blocks > 0 ? "font-semibold text-destructive" : "font-semibold"
            }
          >
            {blocks}
          </span>
        </div>

        {isClean && (
          <p className="text-[11px] text-muted-foreground">
            {t("stats.discipline_clean")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
