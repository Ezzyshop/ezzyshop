"use client";
import {
  HeartIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "@repo/ui/components/icons/index";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { CartDock } from "./cart-dock";
import { CustomLink } from "../custom-link";

export const Dock = () => {
  const pathname = usePathname();

  const dockElements = [
    {
      icon: <HomeIcon />,
      href: `/home`,
      label: "Home",
    },
    {
      icon: <SearchIcon />,
      href: `/categories`,
      label: "Search",
    },
    {
      icon: <CartDock />,
      href: `/cart`,
      label: "Cart",
    },
    {
      icon: <HeartIcon />,
      href: `/wishlist`,
      label: "Wishlist",
    },
    {
      icon: <UserIcon />,
      href: `/profile`,
      label: "Profile",
    },
  ];
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white flex justify-around items-center p-4 border-t">
      {dockElements.map((element) => {
        const isActive = pathname.includes(element.href);
        return (
          <CustomLink
            key={element.label}
            href={element.href}
            className={cn(isActive && "text-primary")}
          >
            {element.icon}
          </CustomLink>
        );
      })}
    </div>
  );
};
