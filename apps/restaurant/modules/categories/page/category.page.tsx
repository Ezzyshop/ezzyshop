"use client";

import { ProductsGrid } from "@/components/products-group/products-grid";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/hooks";
import { ICommonParams } from "@/utils/interfaces";
import { CategoriesService } from "@repo/api/services";
import { ICategoryParams } from "@repo/api/services/category/category.interface";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

let pageTitle: string | undefined;

export const CategoryPage = ({ shopId, categoryId }: ICommonParams) => {
  const { locale } = useParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const params: ICategoryParams = {
    search: debouncedSearch,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["category", categoryId, params],
      queryFn: ({ pageParam }) =>
        CategoriesService.getCategory(shopId, categoryId!, {
          ...params,
          page: pageParam,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.paginationInfo.hasNextPage) {
          return lastPage.paginationInfo.currentPage + 1;
        }
        return undefined;
      },
    });

  pageTitle = pageTitle ?? data?.pages[0]?.data?.name[locale];

  useEffect(() => {
    return () => {
      pageTitle = undefined;
    };
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-medium text-center">{pageTitle}</h1>
      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

      <ProductsGrid
        categoryInfiniteData={data}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
