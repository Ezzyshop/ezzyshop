import { IWishlistItem } from "./wishlist.interface";

const generateWishlistItemId = (productId: string): string => {
  return productId;
};

const calculateWishlistTotals = (items: IWishlistItem[]) => {
  const totalItems = items.length;
  return { totalItems };
};

export { generateWishlistItemId, calculateWishlistTotals };
