import { useShopContext } from "@/contexts/shop.context";
import { IProductResponse } from "@repo/api/services";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  product: IProductResponse;
}

export const ProductPrices = ({ product }: IProps) => {
  const { currency } = useShopContext();
  return (
    <div className="flex items-end gap-2">
      <p
        className={cn(
          "text-xl font-bold",
          product.compare_at_price && "text-primary"
        )}
      >
        {product.price.toLocaleString()} {currency.symbol}
      </p>
      {product.compare_at_price && (
        <p className="text-gray-500 line-through">
          {product.compare_at_price?.toLocaleString()} {currency.symbol}
        </p>
      )}
    </div>
  );
};
