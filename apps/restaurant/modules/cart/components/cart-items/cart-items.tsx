import { useCart } from "@repo/contexts/cart-context/cart.context";
import { CartItem } from "./cart-item";

export const CartItems = () => {
  const { items } = useCart();

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};
