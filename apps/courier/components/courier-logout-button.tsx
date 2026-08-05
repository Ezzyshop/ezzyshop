"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useI18nRouter } from "@repo/i18n/hooks";
import { UserService } from "@repo/api/services/user/user.service";
import { closeSupportSocket } from "@repo/api/socket";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { Button } from "@repo/ui/components/ui/button";
import { LogOut } from "lucide-react";
import { CourierProfileLinkButton } from "./courier-profile-link-button";

export const CourierLogoutButton = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => UserService.logoutUser(),
    onSettled: () => {
      // The OTP token lives in localStorage — clear it so the socket
      // does not reconnect with the previous courier's identity.
      localStorage.removeItem("st");
      closeSupportSocket();
      queryClient.clear();
      setIsOpen(false);
      router.replace("/login");
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="w-full" asChild>
        <div className="w-full">
          <CourierProfileLinkButton
            icon={<LogOut className="size-4 text-white" />}
            title={t("profile.logout")}
            variant="destructiveGhost"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-3 py-5 px-3">
          <DrawerTitle className="text-center">
            {t("profile.logout_confirmation")}
          </DrawerTitle>
          <div className="flex items-center justify-center gap-3 w-full">
            <Button
              variant="outline"
              className="w-1/2"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              {t("profile.cancel")}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="w-1/2"
              disabled={isPending}
              onClick={() => logout()}
            >
              {t("profile.logout")}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
