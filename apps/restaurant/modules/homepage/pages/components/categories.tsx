import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { cn } from "@repo/ui/lib/utils";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TMergedProductAndCategory } from "../../utils/types";

interface IProps {
  categories: TMergedProductAndCategory[];
}
export const Categories = ({ categories }: IProps) => {
  const language = useLocale() as keyof ILocale;
  const categoryLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );

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

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide sticky top-0 z-10 bg-background py-2">
      {categories?.map((category) => (
        <a
          key={category._id}
          ref={(element) => {
            categoryLinkRefs.current[category._id] = element;
          }}
          href={`#category-${category._id}`}
          className={cn(
            "text-sm font-medium whitespace-nowrap block px-2 py-1 opacity-50 rounded-md first:ml-4 last:mr-4 transition-all duration-300",
            "hover:bg-accent ",
            category._id === currentCategoryId && "bg-accent opacity-100"
          )}
        >
          {category.name[language]}
        </a>
      ))}
    </div>
  );
};
