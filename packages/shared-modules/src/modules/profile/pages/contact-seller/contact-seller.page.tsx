"use client";

import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { SupportSessionService } from "@repo/api/services/support-session/support-session.service";
import {
  ISupportSession,
  SupportSessionStatus,
} from "@repo/api/services/support-session/support-session.interface";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@repo/ui/components/ui/button";
import { PlusIcon } from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";

export const ContactSellerPage = () => {
  const { shopId, locale } = useParams<ICommonParams>();
  const router = useRouter();
  const t = useTranslations("contact_seller");

  const { data, isLoading } = useQuery({
    queryKey: ["support-sessions", shopId],
    queryFn: () => SupportSessionService.listSessions(shopId, { limit: 50 }),
  });

  const goToChat = (sessionId: string) => {
    router.push(`/${locale}/${shopId}/profile/contact-seller/${sessionId}`);
  };

  const createNew = () => {
    router.push(`/${locale}/${shopId}/profile/contact-seller/new`);
  };

  const sessions = data?.data ?? [];

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader title={t("title")} />

      <div className="px-4 pb-4 flex-grow flex flex-col gap-3">
        <Button onClick={createNew} size="lg" className="w-full">
          <PlusIcon className="w-4 h-4 mr-1" />
          {t("new_session")}
        </Button>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            {t("no_sessions")}
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s: ISupportSession) => (
              <button
                key={s._id}
                onClick={() => goToChat(s._id)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium line-clamp-1">{s.subject}</div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full shrink-0",
                      s.status === SupportSessionStatus.Resolved
                        ? "bg-muted text-muted-foreground"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {s.status === SupportSessionStatus.Resolved
                      ? t("resolved")
                      : t("open")}
                  </span>
                </div>
                {s.lastMessagePreview && (
                  <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {s.lastMessagePreview}
                  </div>
                )}
                {s.unreadForUser > 0 && (
                  <div className="text-xs text-primary mt-1">
                    {s.unreadForUser} {t("unread")}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
