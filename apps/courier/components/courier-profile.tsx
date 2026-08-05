"use client";
import { useTranslations } from "next-intl";
import { useI18nRouter } from "@repo/i18n/hooks";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Card } from "@repo/ui/components/ui/card";
import { Loader2, LogIn, UserRound, Wallet } from "lucide-react";
import { useCourierContext } from "@/contexts/courier.context";
import { CourierProfileLinkButton } from "./courier-profile-link-button";
import { CourierLanguageButton } from "./courier-language-button";
import { CourierLogoutButton } from "./courier-logout-button";

export const CourierProfile = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { profile, isLoading, isCourier } = useCourierContext();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold">{t("profile.title")}</h1>
      </header>

      <div className="flex-1 space-y-3 p-4 pb-24">
        {!isCourier ? (
          <>
            <Card className="flex h-[30vh] flex-col items-center justify-center gap-3 border-0 shadow-none">
              <Avatar className="size-16">
                <AvatarFallback>
                  <UserRound className="size-7 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">
                {t("profile.logout_state_message")}
              </p>
            </Card>
            <CourierProfileLinkButton
              icon={<LogIn className="size-4 text-white" />}
              title={t("profile.login")}
              onClick={() => router.push("/login")}
            />
            <CourierLanguageButton />
          </>
        ) : (
          <>
            <Card className="flex flex-row items-center gap-3 rounded-lg border-0 bg-card p-4 shadow-none">
              <Avatar className="size-12">
                <AvatarImage src={profile?.photo ?? undefined} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-medium">{profile?.full_name}</h3>
                <p className="truncate text-sm text-muted-foreground">
                  {profile?.phone}
                </p>
              </div>
            </Card>

            <CourierProfileLinkButton
              icon={<Wallet className="size-4 text-white" />}
              title={t("dock.debts")}
              onClick={() => router.push("/debts")}
            />
            <CourierLanguageButton />
            <CourierLogoutButton />
          </>
        )}
      </div>
    </div>
  );
};
