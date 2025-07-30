"use client";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ProductsCard } from "../products-card/products-card";
import { InView } from "react-intersection-observer";
import { Loader2, NoResultIcon } from "@repo/ui/components/icons/index";
import { ProductCardSkeleton } from "../products-card/product-card-skeleton";
import { InfiniteData } from "@tanstack/react-query";
import { IPaginatedData } from "@repo/api/utils/interfaces";
import { ICategoryResponse } from "@repo/api/services/category/category.interface";
import { useTranslations } from "next-intl";

interface IProps {
  data?: IProductResponse[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  infiniteData?: InfiniteData<IPaginatedData<IProductResponse>>;
  categoryInfiniteData?: InfiniteData<ICategoryResponse>;
}

export const ProductsGrid = ({
  data,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  infiniteData,
  categoryInfiniteData,
}: IProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (categoryInfiniteData) {
    if (categoryInfiniteData.pages[0]?.products.length === 0) {
      return <NoProductsFound />;
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {categoryInfiniteData.pages.map((page) =>
          page.products.map((product) => (
            <ProductsCard key={product._id} product={product} />
          ))
        )}

        <FetchNextPage
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    );
  }

  if (infiniteData) {
    if (infiniteData.pages[0]?.data.length === 0) {
      return <NoProductsFound />;
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {infiniteData.pages.map((page) =>
          page.data.map((product) => (
            <ProductsCard key={product._id} product={product} />
          ))
        )}

        <FetchNextPage
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    );
  }

  if (data) {
    if (data.length === 0) {
      return <NoProductsFound />;
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {data?.map((product) => (
          <ProductsCard key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return null;
};

const NoProductsFound = () => {
  const t = useTranslations("product");

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-13rem)]">
      <NoResultIcon className="w-20 h-20 opacity-50" />
      <p className="text-sm text-gray-500 mt-3">{t("no-products-found")}</p>
    </div>
  );
};

const FetchNextPage = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}) => {
  return (
    <>
      {hasNextPage && (
        <InView
          as="div"
          onChange={(inView) => {
            if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage?.();
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
