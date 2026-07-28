"use client";
import { useEffect, useState } from "react";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/ui/button";
import { BellRing, Loader2, PackageCheck } from "lucide-react";
import {
  CourierService,
  ICourierOrder,
} from "@repo/api/services/courier/index";
import { useCourierContext } from "@/contexts/courier.context";
import { useCourierFeed } from "@/hooks/use-courier-feed";
import { isAudioUnlocked, unlockAudio } from "@/utils/audio";
import { OrderCard } from "./order-card";
import { CourierEarnings } from "./courier-earnings";
import { CourierLanguageSwitcher } from "./courier-language-switcher";

export const CourierFeed = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { profile, isLoading: isProfileLoading, isCourier } = useCourierContext();
  const [soundArmed, setSoundArmed] = useState(true);

  useEffect(() => {
    if (!isProfileLoading && !isCourier) {
      router.replace("/login");
    }
  }, [isProfileLoading, isCourier, router]);

  useEffect(() => {
    setSoundArmed(isAudioUnlocked());
  }, []);

  const { orders, isLoading, removeOrder } = useCourierFeed(isCourier);
  const queryClient = useQueryClient();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const { mutate: accept } = useMutation({
    mutationFn: (order: ICourierOrder) =>
      CourierService.acceptOrder(order.shopId, order.orderId),
    onMutate: (order) => setAcceptingId(order.orderId),
    onSuccess: (res, order) => {
      if (res.already_accepted) {
        toast.info(t("already_taken"));
      } else {
        toast.success(t("accepted_success"));
        // Refresh the active-orders list so the dock badge reflects the new order
        queryClient.invalidateQueries({ queryKey: ["courier-active-orders"] });
      }
      removeOrder(order.orderId);
    },
    onError: () => toast.error(t("accept_error")),
    onSettled: () => setAcceptingId(null),
  });

  if (isProfileLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("greeting")}</p>
            <p className="font-semibold">{profile?.full_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <CourierEarnings />
            <CourierLanguageSwitcher />
          </div>
        </div>
        {!soundArmed && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => {
              unlockAudio();
              setSoundArmed(true);
            }}
          >
            <BellRing className="size-4" />
            {t("enable_sound")}
          </Button>
        )}
      </header>

      <div className="flex-1 space-y-3 p-4">
        {isLoading ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-16 text-center text-muted-foreground">
            <PackageCheck className="size-10" />
            <p>{t("empty")}</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onAccept={(o) => accept(o)}
              isAccepting={acceptingId === order.orderId}
            />
          ))
        )}
      </div>
    </div>
  );
};
