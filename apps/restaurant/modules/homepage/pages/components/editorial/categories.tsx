"use client";

import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { cn } from "@repo/ui/lib/utils";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TMergedProductAndCategory } from "../../../utils/types";

interface IProps {
  categories: TMergedProductAndCategory[];
}

export const Categories = ({ categories }: IProps) => {
  const language = useLocale() as keyof ILocale;
  const categoryLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateCategoryIdFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const parsedCategoryId = hash.startsWith("category-")
        ? (hash.split("category-")[1] ?? null)
        : null;

      setCurrentCategoryId(parsedCategoryId);
    };

    updateCategoryIdFromHash();
    window.addEventListener("hashchange", updateCategoryIdFromHash);

    return () => {
      window.removeEventListener("hashchange", updateCategoryIdFromHash);
    };
  }, []);

  useEffect(() => {
    if (!currentCategoryId) return;

    const activeCategoryLink = categoryLinkRefs.current[currentCategoryId];
    if (!activeCategoryLink) return;

    activeCategoryLink.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentCategoryId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-20 transition-[background,backdrop-filter,border-color] duration-200",
        scrolled
          ? "bg-background/85 backdrop-blur-md backdrop-saturate-150 border-b border-border/60"
          : "bg-background border-b border-transparent"
      )}
    >
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 px-4">
        {categories?.map((category) => {
          const isActive = category._id === currentCategoryId;
          const count = category.products.length;
          return (
            <a
              key={category._id}
              ref={(element) => {
                categoryLinkRefs.current[category._id] = element;
              }}
              href={`#category-${category._id}`}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold border transition-colors flex-shrink-0",
                isActive
                  ? "bg-foreground text-background border-transparent"
                  : "bg-card text-foreground/85 border-border/60 hover:bg-accent"
              )}
            >
              {category.name[language]}
              <span
                className={cn(
                  "text-[11px] font-bold tabular-nums",
                  isActive ? "text-background/55" : "text-muted-foreground"
                )}
              >
                {count}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
