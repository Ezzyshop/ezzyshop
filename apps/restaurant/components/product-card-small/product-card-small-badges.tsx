import { IProductResponse } from "@repo/api/services/products/product.interface";
import { Badge } from "@repo/ui/components/ui/badge";

interface IProps {
  product: IProductResponse;
}
export const ProductCardSmallBadges = ({ product }: IProps) => {
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
    <div className="absolute bottom-1 left-1 flex  gap-1">
      {isProductNew && (
        <Badge className="bg-primary text-white p-[2px] px-1 rounded-sm">
          <span className="text-[8px]">Yangi</span>
        </Badge>
      )}
      {getSalePercentage() > 0 && (
        <Badge variant="destructive" className="p-[2px] px-1 rounded-sm">
          <span className="text-[8px]">-{getSalePercentage().toFixed(0)}%</span>
        </Badge>
      )}
    </div>
  );
};
