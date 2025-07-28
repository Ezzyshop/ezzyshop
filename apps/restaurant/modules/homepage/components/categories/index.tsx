"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@repo/api/services";

interface IProps {
  shopId: string;
}

export const Categories = ({ shopId }: IProps) => {
  const { data } = useQuery({
    queryKey: ["categories", shopId],
    queryFn: () => CategoriesService.getCategories(shopId),
  });

  return <div>categories</div>;
};
