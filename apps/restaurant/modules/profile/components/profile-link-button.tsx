"use client";

import { ICommonParams } from "@/utils/interfaces";
import { ChevronRightIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ReactNode } from "react";

interface IProps {
  icon: ReactNode;
  title: string;
  variant?: "ghost" | "destructiveGhost";
  href?: string;
  hidden?: boolean;
}
export const ProfileLinkButton = ({
  icon,
  title,
  variant = "ghost",
  href,
  hidden = false,
}: IProps) => {
  const { shopId, locale } = useParams<ICommonParams>();
  const router = useRouter();

  if (hidden) return null;

  const handleClick = () => {
    if (href) {
      router.push(`/${locale}/${shopId}/profile/${href}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex items-center gap-3 rounded-lg w-full has-[>svg]:px-3 "
      variant={variant}
      size="xl"
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          variant === "destructiveGhost" ? "bg-destructive" : "bg-primary "
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-medium flex-grow text-start">{title}</span>
      <ChevronRightIcon className="w-6 h-6" />
    </Button>
  );
};
