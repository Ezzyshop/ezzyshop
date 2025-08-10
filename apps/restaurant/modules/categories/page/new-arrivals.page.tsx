"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ProductsGrid } from "@/components/products-group/products-grid";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { ICommonParams } from "@/utils/interfaces";
import { ProductService } from "@repo/api/services/products/index";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const NewArrivalsProductsPage = ({ shopId }: ICommonParams) => {
  const t = useTranslations("homepage.products");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const filterQuery = {
    search: debouncedSearch,
  };

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["new-arrivals-products", filterQuery],
      queryFn: ({ pageParam = 1 }) =>
        ProductService.getProductsByCategory(shopId, "new-arrivals", {
          ...filterQuery,
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

  return (
    <div className="space-y-3">
      <PageHeader title={t("new-arrivals")} />
      <div className="px-4 pb-3 space-y-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ProductsGrid
          infiniteData={data}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};
