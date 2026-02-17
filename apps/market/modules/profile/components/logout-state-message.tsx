import { useShopContext } from "@/contexts/shop.context";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Card } from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const LogoutStateMessage = () => {
  const { logo, name } = useShopContext();
  const { user } = useUserContext();
  const t = useTranslations("profile");

  if (user) return null;

  return (
    <Card className="h-[30vh] flex flex-col items-center justify-center gap-3 shadow-none border-0">
      {!logo ? (
        <Avatar className="size-16">
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <Image
          src={logo}
          alt="logo"
          className="rounded-xl object-fill max-w-full w-fit"
          height={96}
          width={96}
          fetchPriority="high"
        />
      )}
      <p className="text-sm text-muted-foreground">
        {t("logout_state_message")}
      </p>
    </Card>
  );
};

//#ffa647
