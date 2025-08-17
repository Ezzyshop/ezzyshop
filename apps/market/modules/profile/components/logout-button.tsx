"use client";
import { LogoutUser } from "@/components/auth-drawers/logout-out-drawer";
import { LogOut } from "@repo/ui/components/icons/index";
import { ProfileLinkButton } from "./profile-link-button";
import { useTranslations } from "next-intl";
import { useUserContext } from "@repo/contexts/user-context/user.context";

export const LogoutButton = () => {
  const t = useTranslations("profile");
  const { user } = useUserContext();
  return (
    <LogoutUser className="w-full">
      <ProfileLinkButton
        icon={<LogOut className="text-white" />}
        title={t("logout")}
        variant="destructiveGhost"
        hidden={!user}
      />
    </LogoutUser>
  );
};
