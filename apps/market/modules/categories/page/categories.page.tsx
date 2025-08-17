"use client";
import {
  ICategoryParams,
  CategoriesService,
  ICategoriesResponse,
} from "@repo/api/services/category/index";
import { Loader2 } from "@repo/ui/components/icons/index";

import { ICommonParams } from "@/utils/interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CategoryCard } from "../components/category-card";
import { CategoryCardSkeleton } from "../components/category-card-skeleton";
import { SearchInput } from "@/components/search-input";
import { useState } from "react";
import { useDebounce } from "@/hooks";
import { InView } from "react-intersection-observer";
import { PageHeader } from "@/components/page-header/page-header";

export const CategoriesPage = ({ shopId }: ICommonParams) => {
  const t = useTranslations("categories");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const filter: ICategoryParams = {
    is_popular: false,
    search: debouncedSearch,
    limit: 8,
  };

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["categories", shopId, filter],
      queryFn: ({ pageParam = 1 }) =>
        CategoriesService.getPublicCategories(shopId, {
          page: pageParam,
          ...filter,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.paginationInfo.hasNextPage) {
          return lastPage.paginationInfo.currentPage + 1;
        }

        return undefined;
      },

      initialPageParam: 1,
    });

  const getCategories = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ));
    }

    if (!data) {
      return null;
    }

    return (
      <>
        {data.pages.map((page) =>
          page.data.map((category: ICategoriesResponse) => (
            <CategoryCard key={category._id} category={category} />
          ))
        )}
        {hasNextPage && (
          <InView
            as="div"
            onChange={(inView) => {
              if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
          />
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center items-center col-span-2">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-3">
      <PageHeader title={t("title")} />
      <div className="px-4 pb-3 space-y-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">{getCategories()}</div>
      </div>
    </div>
  );
};
