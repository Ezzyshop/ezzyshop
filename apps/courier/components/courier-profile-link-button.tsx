"use client";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface IProps {
  icon: ReactNode;
  title: string;
  variant?: "ghost" | "destructiveGhost";
  onClick?: () => void;
  hidden?: boolean;
  badge?: string | number;
}

export const CourierProfileLinkButton = ({
  icon,
  title,
  variant = "ghost",
  onClick,
  hidden = false,
  badge,
}: IProps) => {
  if (hidden) return null;

  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg w-full has-[>svg]:px-3 shadow-none"
      variant={variant}
      size="xl"
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          variant === "destructiveGhost" ? "bg-destructive" : "bg-primary"
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-medium flex-grow text-start">{title}</span>
      {badge !== undefined && (
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className="size-5" />
    </Button>
  );
};
