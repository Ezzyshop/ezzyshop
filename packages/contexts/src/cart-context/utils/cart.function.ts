import { ICartItem } from "./cart.interface";

const generateCartItemId = (productId: string, variantId?: string): string => {
  return variantId ? `${productId}-${variantId}` : productId;
};

const calculateItemPrice = (item: ICartItem): number => {
  return (item.variant?.price || item.product.price) * item.quantity;
};

const calculateTotals = (items: ICartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  return { totalItems, totalPrice };
};

export { generateCartItemId, calculateItemPrice, calculateTotals };
