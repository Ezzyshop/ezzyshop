"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useTranslations } from "next-intl";
import { ProfileLinkButton } from "../components/profile-link-button";
import {
  MapPinIcon,
  ShoppingBagIcon,
  User2Icon,
} from "@repo/ui/components/icons/index";
import { UserProfileCard } from "../components/user-profile-card";
import { LogoutStateMessage } from "../components/logout-state-message";
import { LoginButton } from "../components/login-button";
import { ChangeLanguageButton } from "../components/change-language-button";
import { LogoutUser } from "../components/auth/logout-user";

export const ProfilePage = () => {
  const t = useTranslations("profile");
  const { user } = useUserContext();

  return (
    <div className="space-y-3">
      <PageHeader title={t("title")} />
      <div className="space-y-3 px-4 pb-3">
        <LogoutStateMessage />
        <UserProfileCard />
        <ProfileLinkButton
          icon={<User2Icon className="text-white" />}
          title={t("profile")}
          href="/edit"
          hidden={!user}
        />
        <ProfileLinkButton
          icon={<ShoppingBagIcon className="text-white" />}
          title={t("orders")}
          href="/orders"
          hidden={!user}
        />
        <ProfileLinkButton
          icon={<MapPinIcon className="text-white" />}
          title={t("addresses")}
          href="/addresses"
          hidden={!user}
        />
        <ChangeLanguageButton />
        <LogoutUser />
        <LoginButton />
      </div>
    </div>
  );
};
