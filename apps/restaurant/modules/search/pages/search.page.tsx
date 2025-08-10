"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ProductsGrid } from "@/components/products-group/products-grid";
import { SearchInput } from "@/components/search-input";
import { ProductService } from "@repo/api/services/products/product.service";
import { useQueryParams } from "@repo/hooks/use-query-params";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { debounce } from "lodash";
import { ProductsFilters } from "@/components/products-group/products-filters";

export default function SearchPage() {
  const { shopId } = useParams();
  const { getQueryParams, setQueryParams } = useQueryParams();

  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products", { ...getQueryParams() }],
    queryFn: ({ pageParam = 1 }) =>
      ProductService.getPublicProducts(shopId as string, {
        ...getQueryParams(),
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginationInfo.hasNextPage) {
        return lastPage.paginationInfo.currentPage + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
  });

  const t = useTranslations("search");

  const filterBySearch = (value: string) => {
    setQueryParams({ ...getQueryParams(), search: value });
  };

  return (
    <div>
      <PageHeader title={t("title")} />
      <div className="px-4 space-y-3 mt-1">
        <SearchInput
          onChange={debounce(
            ({ target: { value } }) => filterBySearch(value?.trim()),
            500
          )}
          defaultValue={getQueryParams()?.search as string}
        />
        <ProductsFilters
          getQueryParams={getQueryParams}
          setQueryParams={setQueryParams}
        />
        <ProductsGrid
          infiniteData={products}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
}
