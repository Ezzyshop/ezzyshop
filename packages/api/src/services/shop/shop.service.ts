import { IData } from "@repo/api/utils/interfaces";
import { IShopResponse } from "./shop.interface";
import { api } from "../../api";

export class ShopService {
  static async getShop(shopId: string): Promise<IData<IShopResponse>> {
    const response = await api.get(`/shops/${shopId}`);
    return response.data;
  }
}
