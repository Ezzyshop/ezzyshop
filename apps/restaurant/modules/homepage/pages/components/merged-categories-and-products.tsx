"use client";

import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { TMergedProductAndCategory } from "../../utils/types";
import { ProductCard } from "@/components/product-card/product-card";

interface IProps {
  mergedCategoriesAndProducts: TMergedProductAndCategory[];
}

export const MergedCategoriesAndProducts = ({
  mergedCategoriesAndProducts,
}: IProps) => {
  const language = useLocale() as keyof ILocale;

  useEffect(() => {
    if (!mergedCategoriesAndProducts.length) return;

    let animationFrameId = 0;
    const topOffset = 96;

    const syncHashWithVisibleCategory = () => {
      const categorySections = mergedCategoriesAndProducts
        .map((item) => document.getElementById(`category-${item._id}`))
        .filter((element): element is HTMLElement => Boolean(element));

      if (!categorySections.length) return;

      let targetSection =
        categorySections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.bottom > topOffset && rect.top < window.innerHeight;
        }) ?? null;

      if (!targetSection && window.scrollY <= 0) {
        targetSection = categorySections[0] ?? null;
      }

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (!targetSection && isAtBottom) {
        targetSection = categorySections[categorySections.length - 1] ?? null;
      }

      if (!targetSection) return;

      const nextHash = `#${targetSection.id}`;
      if (window.location.hash === nextHash) return;

      window.history.replaceState(window.history.state, "", nextHash);
      window.dispatchEvent(new Event("hashchange"));
    };

    const handleScrollOrResize = () => {
      if (animationFrameId) return;

      animationFrameId = window.requestAnimationFrame(() => {
        syncHashWithVisibleCategory();
        animationFrameId = 0;
      });
    };

    syncHashWithVisibleCategory();
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mergedCategoriesAndProducts]);

  return (
    <div className="px-4 space-y-4">
      {mergedCategoriesAndProducts.map((item) => (
        <div key={item._id} id={`category-${item._id}`} className="scroll-mt-12">
          <span className="font-bold text-lg">{item.name[language]}</span>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {item.products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
