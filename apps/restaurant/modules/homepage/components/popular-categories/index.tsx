"use client";

import { ICommonParams } from "@/utils/interfaces";
import { CategoriesService } from "@repo/api/services";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export const PopularCategories = ({ shopId }: ICommonParams) => {
  const t = useTranslations("homepage.popular_categories");

  const params = {
    // is_popular: true,
  };

  const { data: categories } = useQuery({
    queryKey: ["categories", shopId, params],
    queryFn: () => CategoriesService.getCategories(shopId, params),
  });

  if (!categories?.data.length) return null;

  return (
    <div className="">
      <h2 className="font-semibold text-xl px-4">{t("title")}</h2>

      <Carousel
        className="mt-3 h-[160px]"
        opts={{
          loop: true,
          inViewThreshold: 0.5,
        }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {categories?.data.map((category) => (
            <CarouselItem key={category._id} className="basis-[80%]">
              <Image
                src={category?.image || ""}
                alt={category.name}
                width={425}
                height={160}
                className="object-cover w-[425px] h-[160px] rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots className="-bottom-5" />
      </Carousel>
    </div>
  );
};
