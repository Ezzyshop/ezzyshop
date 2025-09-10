import { ICartItem } from "./cart.interface";

const generateCartItemId = (productId: string, variantId?: string): string => {
  return variantId ? `${productId}-${variantId}` : productId;
};

const calculateItemPrice = (item: ICartItem): number => {
  return item.variant!.price * item.quantity;
};

const calculateTotals = (items: ICartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  // totalDiscount is based on product.compare_at_price if present.
  // We assume compare_at_price is the pre-discount price for the base product (variants may override selling price but not compare_at_price per schema).
  const totalDiscount = items.reduce((sum, item) => {
    const sellingUnitPrice = item.variant!.price;
    const compareAt = item.variant!.compare_at_price ?? null;
    if (!compareAt || compareAt <= sellingUnitPrice) return sum;
    const discountPerUnit = compareAt - sellingUnitPrice;
    return sum + discountPerUnit * item.quantity;
  }, 0);
  const totalPriceWithoutDiscount = items.reduce((sum, item) => {
    const sellingUnitPrice = item.variant!.price;
    const compareAt = item.variant!.compare_at_price ?? null;
    const baseUnitPrice =
      compareAt && compareAt > 0 ? compareAt : sellingUnitPrice;
    return sum + baseUnitPrice * item.quantity;
  }, 0);
  return { totalItems, totalPrice, totalDiscount, totalPriceWithoutDiscount };
};

export { generateCartItemId, calculateItemPrice, calculateTotals };
