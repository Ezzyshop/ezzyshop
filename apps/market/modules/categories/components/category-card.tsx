import { CustomLink } from "@/components/custom-link";
import { ICategoriesResponse } from "@repo/api/services/category/category.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { useLocale } from "next-intl";
import Image from "next/image";

interface IProps {
  category: ICategoriesResponse;
}

export const CategoryCard = ({ category }: IProps) => {
  const locale = useLocale() as keyof ILocale;
  return (
    <CustomLink href={`/categories/${category._id}`}>
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <Image
          src={category.image || ""}
          alt={category.name[locale]}
          fill
          className="object-cover "
        />
      </div>
      <h2 className="font-medium">{category.name[locale]}</h2>
    </CustomLink>
  );
};
