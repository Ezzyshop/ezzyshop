import { ICartItem } from "./cart.interface";

const generateCartItemId = (productId: string, variantId?: string): string => {
  return variantId ? `${productId}-${variantId}` : productId;
};

const calculateItemPrice = (item: ICartItem): number => {
  const price = item.variant?.price ?? item.product?.variants?.[0]?.price ?? 0;
  return price * item.quantity;
};

const calculateTotals = (items: ICartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  const totalDiscount = items.reduce((sum, item) => {
    const sellingUnitPrice = item.variant?.price ?? item.product?.variants?.[0]?.price ?? 0;
    const compareAt = item.variant?.compare_at_price ?? null;
    if (!compareAt || compareAt <= sellingUnitPrice) return sum;
    return sum + (compareAt - sellingUnitPrice) * item.quantity;
  }, 0);
  const totalPriceWithoutDiscount = items.reduce((sum, item) => {
    const sellingUnitPrice = item.variant?.price ?? item.product?.variants?.[0]?.price ?? 0;
    const compareAt = item.variant?.compare_at_price ?? null;
    const baseUnitPrice = compareAt && compareAt > 0 ? compareAt : sellingUnitPrice;
    return sum + baseUnitPrice * item.quantity;
  }, 0);
  return { totalItems, totalPrice, totalDiscount, totalPriceWithoutDiscount };
};

export { generateCartItemId, calculateItemPrice, calculateTotals };
