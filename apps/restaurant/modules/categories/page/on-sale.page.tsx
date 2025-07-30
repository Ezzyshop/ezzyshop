"use client";
import { ProductsGrid } from "@/components/products-group/products-grid";
import { SearchInput } from "@/components/search-input";
import { useDebounce } from "@/hooks/use-debounce";
import { ICommonParams } from "@/utils/interfaces";
import { ProductService } from "@repo/api/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const OnSaleProductsPage = ({ shopId }: ICommonParams) => {
  const t = useTranslations("homepage.products");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const filterQuery = {
    search: debouncedSearch,
  };

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["on-sale-products", filterQuery],
    queryFn: () => ProductService.getProductsByCategory(shopId, "on-sale", filterQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.paginationInfo.hasNextPage) {
        return lastPage.paginationInfo.currentPage + 1;
      }

      return undefined;
    },
  });

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-2xl font-bold">{t("on-sale")}</h2>
      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
      {data?.pages.map((page) => (
        <ProductsGrid
          key={page.paginationInfo.currentPage}
          data={page.data}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      ))}
    </div>
  );
};
