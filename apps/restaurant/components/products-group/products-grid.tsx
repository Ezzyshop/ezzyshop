import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ProductsCard } from "../products-card/products-card";
import { InView } from "react-intersection-observer";
import { Loader2 } from "@repo/ui/components/icons/index";
import { ProductCardSkeleton } from "../products-card/product-card-skeleton";

interface IProps {
  data: IProductResponse[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const ProductsGrid = ({
  data,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: IProps) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {data.map((product) => (
        <ProductsCard key={product._id} product={product} />
      ))}

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
    </div>
  );
};
