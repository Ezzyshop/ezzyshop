import { IProductResponse } from "@repo/api/services/products/product.interface";
import { HeartIcon } from "@repo/ui/components/icons/index";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { useWishlist } from "@repo/contexts/wishlist-context/wishlist.context";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  product: IProductResponse;
  variant: IProductResponse["variants"][number];
}

export const ProductBadges = ({ product, variant }: IProps) => {
  const { isItemInWishlist, toggleItem } = useWishlist();

  const isProductNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // 7 days

  const getSalePercentage = () => {
    if (!variant.compare_at_price) return 0;

    return (
      ((variant.compare_at_price - variant.price) / variant.compare_at_price) *
      100
    );
  };

  const isInWishlist = isItemInWishlist(product._id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <div className="absolute top-2 left-0 px-2 flex items-center justify-between w-full gap-2">
      <div className="space-x-2 flex items-center">
        {isProductNew && (
          <Badge className="bg-primary text-white">
            <span className="text-[10px]">Yangi</span>
          </Badge>
        )}
        {getSalePercentage() > 0 && (
          <Badge variant="destructive">
            <span className="text-[10px]">
              -{getSalePercentage().toFixed(0)}%
            </span>
          </Badge>
        )}
      </div>
      <div>
        <Button
          variant="outline"
          size="icon"
          className={cn("size-6 bg-opacity-50 border-0 shadow-none")}
          onClick={handleWishlistToggle}
        >
          <HeartIcon className={cn("size-4", isInWishlist && "fill-primary stroke-primary")} />
        </Button>
      </div>
    </div>
  );
};
