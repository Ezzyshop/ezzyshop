"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CategoriesService,
  ICategoriesResponse,
  ICategoryParams,
} from "@repo/api/services/category/index";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { ILocale } from "@repo/api/utils/interfaces/index";
import { CustomLink } from "@/components/custom-link";

interface IProps {
  shopId: string;
}

export const Categories = ({ shopId }: IProps) => {
  const language = useLocale() as keyof ILocale;
  const t = useTranslations("homepage.categories");

  const filter: ICategoryParams = {
    is_popular: false,
  };

  const { data } = useQuery({
    queryKey: ["categories", shopId, filter],
    queryFn: () => CategoriesService.getPublicCategories(shopId, filter),
  });

  return (
    <div className="mt-14 px-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">{t("title")}</h2>
        <Button variant="link">
          <CustomLink href="/categories" locale={language}>
            {t("viewAll")}
          </CustomLink>
        </Button>
      </div>
      <div className="grid grid-cols-4 place-content-center gap-2 mt-3 ">
        {data?.data.slice(0, 8).map((category: ICategoriesResponse) => (
          <CustomLink
            key={category._id}
            href={`/categories/${category._id}`}
            className="flex flex-col items-center cursor-pointer"
          >
            <Image
              src={category?.image || ""}
              alt={category.name[language]}
              width={74}
              height={74}
              className=" w-[74px] h-[74px] object-cover rounded-full"
            />
            <p className="text-center text-sm mt-2 font-medium line-clamp-2">
              {category.name[language]}
            </p>
          </CustomLink>
        ))}
      </div>
    </div>
  );
};
