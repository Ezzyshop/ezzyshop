"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@repo/api/services";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

interface IProps {
  shopId: string;
}

export const Categories = ({ shopId }: IProps) => {
  const language = useLocale();
  const t = useTranslations("homepage.categories");
  const { data } = useQuery({
    queryKey: ["categories", shopId],
    queryFn: () => CategoriesService.getCategories(shopId),
  });

  return (
    <div className="mt-10">
      <h2 className="font-semibold text-xl px-4">{t("title")}</h2>
      <div className="grid grid-cols-4 place-content-center gap-2 mt-3">
        {data?.data.map((category) => (
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
            <p className="text-center text-sm mt-2 font-medium">
              {category.name[language]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
