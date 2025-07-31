import { IProductResponse } from "@repo/api/services/products/index";

export interface IWishlistItem {
  id: string; // Product ID
  product: IProductResponse;
  addedAt: number; // timestamp
}

// Wishlist state interface
export interface IWishlistState {
  items: IWishlistItem[];
  isLoading: boolean;
  totalItems: number;
}
