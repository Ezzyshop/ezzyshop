import { AddToCartButton } from "@/components/add-to-cart-button/add-to-cart-button";
import { useShopContext } from "@/contexts/shop.context";
import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  product: IProductResponse;
}

export const ProductAddToCart = ({ product }: IProps) => {
  const { currency } = useShopContext();
  return (
    <Card className="shadow-none border-0 p-3 gap-2">
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
      <AddToCartButton />
    </Card>
  );
};
