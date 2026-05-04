"use client";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useTranslations } from "next-intl";
import { ProfileLinkButton } from "../components/profile-link-button";
import {
  MapPinIcon,
  MessageCircleIcon,
  ShoppingBagIcon,
  StarIcon as StarIconLucide,
  User2Icon,
} from "@repo/ui/components/icons/index";
import { UserProfileCard } from "../components/user-profile-card";
import { LogoutStateMessage } from "../components/logout-state-message";
import { LoginButton } from "../components/login-button";
import { ChangeLanguageButton } from "../components/change-language-button";
import { LogoutButton } from "../components/logout-button";
import { SocialNetworks } from "../components/social-networks";
import { ProfileCouponsButton } from "../components/profile-coupons";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { LinkClickService } from "@repo/api/services/link-click/link-click.service";

export const ProfilePage = () => {
  const t = useTranslations("profile");
  const { user } = useUserContext();
  const { _id: shopId } = useShopContext();

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
          icon={<StarIconLucide className="text-white" />}
          title={t("my_reviews")}
          href="/my-reviews"
          hidden={!user}
        />
        <ProfileLinkButton
          icon={<MapPinIcon className="text-white" />}
          title={t("addresses")}
          href="/addresses"
          hidden={!user}
        />
        <ProfileLinkButton
          icon={<MessageCircleIcon className="text-white" />}
          title={t("contact_seller")}
          href="/contact-seller"
          hidden={!user}
        />
        {user && <ProfileCouponsButton />}
        <ChangeLanguageButton />
        <LogoutButton />
        <LoginButton />
      </div>
      <SocialNetworks />
      <p className="text-muted-foreground text-center text-sm">
        {useTranslations().rich("powered_by", {
          company: "ezzyshop",
          link: (chunks) => (
            <a
              href="https://www.instagram.com/ezzyshopuz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline text-primary"
              onClick={() => LinkClickService.track(shopId)}
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
};
