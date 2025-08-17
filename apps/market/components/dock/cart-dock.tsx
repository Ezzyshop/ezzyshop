import { ShoppingBagIcon } from "@repo/ui/components/icons/index";
import { useCart } from "@repo/contexts/cart-context/cart.context";

export const CartDock = () => {
  const { totalItems } = useCart();

  return (
    <div className="relative">
      <ShoppingBagIcon />
      {totalItems > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-xs">{totalItems}</span>
        </div>
      )}
    </div>
  );
};
