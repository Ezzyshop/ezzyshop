import { ShoppingCartIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";

export const AddToCartButton = () => {
  return (
    <Button className="w-full" size="lg">
      <ShoppingCartIcon className="w-4 h-4" />
      Add to Cart
    </Button>
  );
};
