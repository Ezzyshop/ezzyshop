import { IData } from "@repo/api/utils/interfaces";
import { api } from "@repo/api/api";
import { IShopResponse } from "./shop.interface";

export class ShopService {
  static async getShop(shopId: string): Promise<IData<IShopResponse>> {
    const response = await api.get(`/shops/${shopId}`);
    return response.data;
  }
}
