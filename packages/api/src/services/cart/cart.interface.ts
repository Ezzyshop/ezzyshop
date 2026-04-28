import { IProductResponse } from '../products/product.interface';

export interface ICartSyncItem {
  product: string;
  variant?: string | null;
  quantity: number;
  addedAt: number;
}

export interface IBackendCartItem {
  id: string;
  product: IProductResponse;
  variant: IProductResponse['variants'][number];
  quantity: number;
  addedAt: number;
  isOutOfStock: boolean;
}

export interface ICartSyncResponse {
  synced: boolean;
}

export interface IGetCartResponse {
  items: IBackendCartItem[];
}
