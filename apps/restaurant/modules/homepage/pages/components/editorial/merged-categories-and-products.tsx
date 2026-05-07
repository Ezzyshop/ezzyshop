"use client";

import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { TMergedProductAndCategory } from "../../../utils/types";
import { EditorialDishCard } from "./editorial-dish-card";

interface IProps {
  mergedCategoriesAndProducts: TMergedProductAndCategory[];
  setSelectedProduct: (product: IProductResponse | null) => void;
}

export const MergedCategoriesAndProducts = ({
  mergedCategoriesAndProducts,
  setSelectedProduct,
}: IProps) => {
  const language = useLocale() as keyof ILocale;
  const t = useTranslations("homepage.section");

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
    <div className="px-4 pb-10">
      {mergedCategoriesAndProducts.map((item, index) => {
        const sectionNumber = String(index + 1).padStart(2, "0");
        const count = item.products.length;
        return (
          <section
            key={item._id}
            id={`category-${item._id}`}
            className="scroll-mt-20 pt-8 first:pt-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display italic text-[13px] tracking-wide text-primary">
                № {sectionNumber}
              </span>
              <span
                aria-hidden
                className="flex-1 h-px bg-border"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t("count_label", { count })}
              </span>
            </div>
            <h2 className="font-display mt-2.5 text-[32px] leading-[1.05] tracking-[-0.02em] font-medium text-foreground">
              {item.name[language]}
            </h2>

            <div className="mt-5 grid gap-4">
              {item.products.map((product) => (
                <EditorialDishCard
                  key={product._id}
                  product={product}
                  setSelectedProduct={setSelectedProduct}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
