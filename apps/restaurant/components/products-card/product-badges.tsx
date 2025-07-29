import { IProductResponse } from "@repo/api/services/products/product.interface";
import { Badge } from "@repo/ui/components/ui/badge";

interface IProps {
  product: IProductResponse;
}

export const ProductBadges = ({ product }: IProps) => {
  const isProductNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // 7 days

  const getSalePercentage = () => {
    if (!product.compare_at_price) return 0;

    return (
      ((product.compare_at_price - product.price) / product.compare_at_price) *
      100
    );
  };

  return (
    <div className="absolute top-2 left-2 space-x-2">
      {isProductNew && (
        <Badge className="bg-primary text-white">
          <span className="text-xs">Yangi</span>
        </Badge>
      )}
      {getSalePercentage() > 0 && (
        <Badge variant="destructive">
          <span className="text-xs">-{getSalePercentage().toFixed(0)}%</span>
        </Badge>
      )}
    </div>
  );
};
