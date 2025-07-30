import { ICategoriesResponse } from "@repo/api/services/category/category.interface";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  category: ICategoriesResponse;
  shopId: string;
}

export const CategoryCard = ({ category, shopId }: IProps) => {
  const locale = useLocale();
  return (
    <Link href={`/${shopId}/categories/${category._id}`}>
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <Image
          src={category.image || ""}
          alt={category.name[locale]}
          fill
          className="object-cover "
        />
      </div>
      <h2 className="font-medium">{category.name[locale]}</h2>
    </Link>
  );
};
