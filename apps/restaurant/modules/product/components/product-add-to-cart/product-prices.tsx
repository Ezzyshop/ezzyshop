import { useShopContext } from "@/contexts/shop.context";
import { IProductResponse } from "@repo/api/services/products/index";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  product: IProductResponse;
  selectedVariant?: IProductResponse["variants"][number];
}

export const ProductPrices = ({ product, selectedVariant }: IProps) => {
  const { currency } = useShopContext();

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = product.compare_at_price;

  return (
    <div className="flex items-end gap-2">
      <p className={cn("text-xl font-bold", comparePrice && "text-primary")}>
        {currentPrice.toLocaleString()} {currency.symbol}
      </p>
      {comparePrice && (
        <p className="text-gray-500 line-through">
          {comparePrice.toLocaleString()} {currency.symbol}
        </p>
      )}
    </div>
  );
};
