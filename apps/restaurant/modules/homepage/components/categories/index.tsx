"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@repo/api/services";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { ICategoryParams } from "@repo/api/services/category/category.interface";
import Link from "next/link";

interface IProps {
  shopId: string;
}

export const Categories = ({ shopId }: IProps) => {
  const language = useLocale();
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
        <Link href={`/${shopId}/categories`} locale={language}>
          <span className="text-sm text-primary">{t("viewAll")}</span>
        </Link>
      </div>
      <div className="grid grid-cols-4 place-content-center gap-2 mt-3 ">
        {data?.data.slice(0, 8).map((category) => (
          <div
            key={category._id}
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
          </div>
        ))}
      </div>
    </div>
  );
};
