"use client";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ProductsCard } from "../products-card/products-card";
import { InView } from "react-intersection-observer";
import { Loader2 } from "@repo/ui/components/icons/index";
import { ProductCardSkeleton } from "../products-card/product-card-skeleton";
import { InfiniteData } from "@tanstack/react-query";
import { IPaginatedData } from "@repo/api/utils/interfaces";

interface IProps {
  data?: IProductResponse[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  infiniteData?: InfiniteData<IPaginatedData<IProductResponse>>;
}

export const ProductsGrid = ({
  data,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  infiniteData,
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

  console.log(infiniteData);

  if (infiniteData) {
    if (infiniteData.pages.length === 0) return null;
    return (
      <div className="grid grid-cols-2 gap-3">
        {infiniteData.pages.map((page) =>
          page.data.map((product) => (
            <ProductsCard key={product._id} product={product} />
          ))
        )}

        {hasNextPage && (
          <InView
            as="div"
            onChange={(inView) => {
              if (inView && hasNextPage && !isFetchingNextPage)
                fetchNextPage?.();
            }}
          />
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center items-center col-span-2">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    );
  }

  if (data) {
    if (data.length === 0) return null;
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
