"use client";

import { ICommonParams } from "@/utils/interfaces";
import {
  CategoriesService,
  ICategoriesResponse,
} from "@repo/api/services/category/index";
import { ILocale } from "@repo/api/utils/interfaces/index";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";

export const EditorialHero = () => {
  const language = useLocale() as keyof ILocale;
  const { shopId } = useParams<ICommonParams>();

  const { data: categories } = useQuery({
    queryKey: ["categories", shopId, { is_popular: true }],
    queryFn: () =>
      CategoriesService.getPublicCategories(shopId, { is_popular: true }),
  });

  if (!categories?.data.length) return null;

  return (
    <div className="px-4 pt-1 pb-5">
      <Carousel
        className="rounded-3xl"
        opts={{ loop: true, inViewThreshold: 0.1 }}
        plugins={[Autoplay({ delay: 4000, stopOnMouseEnter: true })]}
      >
        <CarouselContent>
          {categories.data.map((category: ICategoriesResponse) => (
            <CarouselItem key={category._id}>
              <div className="relative overflow-hidden rounded-3xl bg-muted shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-video">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name[language]}
                      fill
                      className="object-cover pointer-events-none select-none"
                      sizes="(max-width: 425px) 100vw, 425px"
                      priority
                      draggable={false}
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {categories.data.length > 1 && (
          <CarouselDots
            className="bottom-4"
            dotClassName="bg-white/55 aria-selected:bg-white aria-selected:w-5"
          />
        )}
      </Carousel>
    </div>
  );
};
