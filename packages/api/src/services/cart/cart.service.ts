import axios from 'axios';
import { IData } from '../../utils/interfaces';
import { ICartSyncItem, ICartSyncResponse, IGetCartResponse } from './cart.interface';

// Dedicated instance without the toast interceptor — cart sync is a background
// operation and failures should never interrupt the user with an error popup.
const silentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9100',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export class CartService {
  static async getCart(shopId: string): Promise<IData<IGetCartResponse>> {
    const response = await silentApi.get(`/cart/${shopId}`);
    return response.data;
  }

  static async syncCart(shopId: string, items: ICartSyncItem[]): Promise<IData<ICartSyncResponse>> {
    const response = await silentApi.put(`/cart/${shopId}`, { items });
    return response.data;
  }

  static async clearCart(shopId: string): Promise<IData<{ cleared: boolean }>> {
    const response = await silentApi.delete(`/cart/${shopId}`);
    return response.data;
  }
}
