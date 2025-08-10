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
import Link from "next/link";
import { ILocale } from "@repo/api/utils/interfaces/index";

export const PopularCategories = ({ shopId }: ICommonParams) => {
  const language = useLocale() as keyof ILocale;
  const params = {
    is_popular: true,
  };

  const { data: categories } = useQuery({
    queryKey: ["categories", shopId, params],
    queryFn: () => CategoriesService.getPublicCategories(shopId, params),
  });

  if (!categories?.data.length) return null;

  return (
    <div className="px-4 space-y-3">
      <Carousel
        className="h-[198px] rounded-xl"
        opts={{
          loop: true,
          inViewThreshold: 0.1,
        }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {categories?.data.map((category: ICategoriesResponse) => (
            <CarouselItem key={category._id}>
              <Link href={`/${shopId}/categories/${category._id}`}>
                <Image
                  src={category?.image || ""}
                  alt={category.name[language]}
                  width={425}
                  height={160}
                  className="object-cover w-[425px] h-auto rounded-lg"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots className="-bottom-10" />
      </Carousel>
    </div>
  );
};
