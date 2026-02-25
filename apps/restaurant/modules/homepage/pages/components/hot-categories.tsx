"use client";

import { ICommonParams } from "@/utils/interfaces";
import {
  CategoriesService,
  ICategoriesResponse,
} from "@repo/api/services/category/index";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ILocale } from "@repo/api/utils/interfaces/index";
import { useParams } from "next/navigation";

export const PopularCategories = () => {
  const language = useLocale() as keyof ILocale;
  const { shopId } = useParams<ICommonParams>();
  const params = {
    is_popular: true,
  };

  const { data: categories } = useQuery({
    queryKey: ["categories", shopId, params],
    queryFn: () => CategoriesService.getPublicCategories(shopId, params),
  });

  if (!categories?.data.length) return null;

  return (
    <div className="p-4 space-y-3">
      <Carousel
        className=" aspect-[3/1] rounded-xl"
        opts={{
          loop: true,
          inViewThreshold: 0.1,
        }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {categories?.data.map((category: ICategoriesResponse) => (
            <CarouselItem key={category._id}>
              <Image
                src={category?.image || ""}
                alt={category.name[language]}
                width={425}
                height={160}
                className="object-cover w-[425px] h-auto rounded-lg"
                fetchPriority="high"
                loading="lazy"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots className="-bottom-10" />
      </Carousel>
    </div>
  );
};
