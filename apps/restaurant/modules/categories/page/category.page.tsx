"use client";

import { PageHeader } from "@/components/page-header/page-header";
import { ProductsGrid } from "@/components/products-group/products-grid";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/hooks";
import { ICommonParams } from "@/utils/interfaces";
import {
  CategoriesService,
  ICategoryParams,
} from "@repo/api/services/category/index";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

let pageTitle: string | undefined;

export const CategoryPage = ({ shopId, categoryId }: ICommonParams) => {
  const locale = useLocale() as keyof ILocale;
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
    <div className="px-4 py-3 space-y-3">
      <PageHeader title={pageTitle} isLoadingTitle={isLoading} />
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
