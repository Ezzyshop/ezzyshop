import { IData } from "../../utils/interfaces/base.interface";
import { api } from "../../api";
import { IShopResponse } from "./shop.interface";

export class ShopService {
  static async getShop(shopId: string): Promise<IData<IShopResponse>> {
    const response = await api.get(`/shops/${shopId}`);
    return response.data;
  }
}
