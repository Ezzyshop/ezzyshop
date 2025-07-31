import { IProductResponse } from "@repo/api/services/products/index";

export interface IViewedProductItem {
  id: string; // Product ID
  product: IProductResponse;
  viewedAt: number; // timestamp of last view
}

// Viewed products state interface
export interface IViewedProductsState {
  items: IViewedProductItem[];
  isLoading: boolean;
  totalItems: number;
}

// Configuration
export const VIEWED_PRODUCTS_LIMIT = 50; // Maximum number of products to keep in history
