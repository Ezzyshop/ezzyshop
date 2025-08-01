import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { ProfileLinkButton } from "./profile-link-button";
import { useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { LogIn } from "@repo/ui/components/icons/index";
import { CheckUser } from "./auth/check-user";
import { useMemo, useState } from "react";
import { CreateUser } from "./auth/create-user";
import { LoginUser } from "./auth/login-user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useShopContext } from "@/contexts/shop.context";

export type Steps = "check-user" | "create-user" | "login";

export const LoginButton = () => {
  const { user } = useUserContext();
  const { name, logo } = useShopContext();
  const t = useTranslations("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<Steps>("check-user");
  const [phone, setPhone] = useState<string | undefined>(undefined);

  const currentStep = useMemo(() => {
    switch (steps) {
      case "check-user":
        return <CheckUser setSteps={setSteps} setPhone={setPhone} />;
      case "create-user":
        return (
          <CreateUser
            setSteps={setSteps}
            phone={phone!}
            setIsOpen={setIsOpen}
          />
        );
      case "login":
        return (
          <LoginUser phone={phone!} setSteps={setSteps} setIsOpen={setIsOpen} />
        );
    }
  }, [steps, phone]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="w-full">
        <ProfileLinkButton
          icon={<LogIn className="text-white" />}
          title={t("login")}
          hidden={!!user}
        />
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerTitle className="text-center hidden">{t("login")}</DrawerTitle>
        <div className="flex flex-col gap-3 pt-16 pb-5 px-3 h-full items-center justify-start">
          <Avatar className="size-16">
            <AvatarImage src={logo ?? undefined} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{t("login_to_shop", { name })}</h1>

          {currentStep}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
