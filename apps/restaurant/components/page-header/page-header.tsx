"use client";
import { ArrowLeftIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
  title?: string;
  description?: string;
  isLoadingTitle?: boolean;
  rightElement?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  isLoadingTitle,
  rightElement,
}: IProps) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn("sticky top-0 z-10 bg-white", isScrolled && "shadow-sm")}
    >
      <div className="flex flex-col justify-center gap-2 px-4 py-4 relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="absolute top-1/2 -translate-y-1/2 left-4 cursor-pointer"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <div className="flex items-center justify-center">
          {isLoadingTitle ? (
            <Skeleton className="h-7 w-1/2 rounded-2xl" />
          ) : (
            <h1 className="text-lg font-medium text-center h-7">{title}</h1>
          )}
          {description && (
            <p className="text-sm text-center text-gray-500">{description}</p>
          )}
        </div>
        {rightElement && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
