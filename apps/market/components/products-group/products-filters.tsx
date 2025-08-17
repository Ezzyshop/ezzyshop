import { TObject } from "@repo/hooks/use-query-params";
import { ProductSortFilter } from "./product-filters/product-sort-filter";
import { ProductPriceFilter } from "./product-filters/product-price-filter";

interface IProps {
  getQueryParams: () => TObject;
  setQueryParams: (params: TObject) => void;
}

export const ProductsFilters = ({ getQueryParams, setQueryParams }: IProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <ProductSortFilter
        getQueryParams={getQueryParams}
        setQueryParams={setQueryParams}
      />
      <ProductPriceFilter
        getQueryParams={getQueryParams}
        setQueryParams={setQueryParams}
      />
    </div>
  );
};
