import { useShopContext } from "@/contexts/shop.context";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Card } from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";

export const LogoutStateMessage = () => {
  const { logo, name } = useShopContext();
  const { user } = useUserContext();
  const t = useTranslations("profile");

  if (user) return null;

  return (
    <Card className="h-[30vh] flex flex-col items-center justify-center gap-3 shadow-none border-0">
      <Avatar className="size-16">
        <AvatarImage src={logo ?? undefined} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="text-sm text-muted-foreground">
        {t("logout_state_message")}
      </p>
    </Card>
  );
};
