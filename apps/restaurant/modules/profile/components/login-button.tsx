import { ProfileLinkButton } from "./profile-link-button";
import { useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { LogIn } from "@repo/ui/components/icons/index";
import { LoginDrawer } from "@/components/auth-drawers/login-drawer";

export const LoginButton = () => {
  const { user } = useUserContext();
  const t = useTranslations("profile");
  return (
    <LoginDrawer className="w-full" asChild>
      <ProfileLinkButton
        icon={<LogIn className="text-white" />}
        title={t("login")}
        hidden={!!user}
      />
    </LoginDrawer>
  );
};
