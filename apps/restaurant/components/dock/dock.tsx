"use client";
import {
  HeartIcon,
  HomeIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@repo/ui/components/icons/index";
import { useLocale } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { ICommonParams } from "@/utils/interfaces";
import { CartDock } from "./cart-dock";

export const Dock = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const { shopId } = useParams<ICommonParams>();

  const dockElements = [
    {
      icon: <HomeIcon />,
      href: `/${locale}/${shopId}/home`,
      label: "Home",
    },
    {
      icon: <SearchIcon />,
      href: `/${locale}/${shopId}/categories`,
      label: "Search",
    },
    {
      icon: <CartDock />,
      href: `/${locale}/${shopId}/cart`,
      label: "Cart",
    },
    {
      icon: <HeartIcon />,
      href: `/${locale}/${shopId}/favorites`,
      label: "Favorites",
    },
    {
      icon: <UserIcon />,
      href: `/${locale}/${shopId}/profile`,
      label: "Profile",
    },
  ];
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white flex justify-around items-center p-4 border-t">
      {dockElements.map((element) => {
        const isActive = pathname.includes(element.href);
        return (
          <Link
            key={element.label}
            href={element.href}
            className={cn(isActive && "text-primary")}
          >
            {element.icon}
          </Link>
        );
      })}
    </div>
  );
};
