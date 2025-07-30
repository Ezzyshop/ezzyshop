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
import Link from "next/link";

export const PopularCategories = ({ shopId }: ICommonParams) => {
  const t = useTranslations("homepage.popular_categories");

  const params = {
    is_popular: true,
  };

  const { data: categories } = useQuery({
    queryKey: ["categories", shopId, params],
    queryFn: () => CategoriesService.getPublicCategories(shopId, params),
  });

  if (!categories?.data.length) return null;

  return (
    <div className="px-4">
      <h2 className="font-semibold text-xl">{t("title")}</h2>

      <Carousel
        className="mt-3 h-[198px] rounded-xl"
        opts={{
          loop: true,
          inViewThreshold: 0.1,
        }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {categories?.data.map((category) => (
            <CarouselItem key={category._id}>
              <Link href={`/${shopId}/categories/${category._id}`}>
                <Image
                  src={category?.image || ""}
                  alt={category.name}
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
