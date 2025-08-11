import { IProductResponse } from "@repo/api/services/products/index";

export interface ICartItem {
  id: string; // Unique identifier for cart item (productId + variantId if exists)
  product: IProductResponse;
  variant?: IProductResponse["variants"][number];
  quantity: number;
  addedAt: number; // timestamp
}

// Cart state interface
export interface ICartState {
  items: ICartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  totalPriceWithoutDiscount: number;
}
