import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { Button } from "@repo/ui/components/ui/button";
import { PropsWithChildren, useState } from "react";
import { useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@repo/api/services/user/user.service";

export const LogoutUser = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("profile");
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  const { mutate: logoutUser } = useMutation({
    mutationFn: () => UserService.logoutUser(),
    onSuccess: async () => {
      await queryClient.setQueryData(["current-user"], null);
      setIsOpen(false);
    },
  });

  if (!user) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={className} asChild>
        <div className="w-full">{children}</div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-3 py-5 px-3">
          <DrawerTitle className="text-center">
            {t("logout_confirmation")}
          </DrawerTitle>
          <div className="flex items-center justify-center gap-3 w-full">
            <Button
              variant="outline"
              className="w-1/2"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="w-1/2"
              onClick={() => logoutUser()}
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
