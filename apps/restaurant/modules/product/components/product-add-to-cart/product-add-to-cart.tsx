import { AddToCartButton } from "@/components/add-to-cart-button/add-to-cart-button";
import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { ProductPrices } from "./product-prices";
import { ProductVariants } from "./product-variants";

interface IProps {
  product: IProductResponse;
}

export const ProductAddToCart = ({ product }: IProps) => {
  return (
    <Card className="shadow-none border-0 p-3 gap-2">
      <ProductPrices product={product} />
      <ProductVariants product={product} />
      <AddToCartButton />
    </Card>
  );
};
