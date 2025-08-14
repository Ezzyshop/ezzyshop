import { IPaginatedData } from "../../utils/interfaces";
import { api } from "../../api";
import {
  IOrderCreateRequest,
  IOrderParams,
  IOrderResponse,
} from "./order.interface";

export class OrderService {
  static async createOrder(shopId: string, order: IOrderCreateRequest) {
    const response = await api.post(`/orders/${shopId}`, order);
    return response.data;
  }

  static async getOrders(
    shopId: string,
    params: IOrderParams
  ): Promise<IPaginatedData<IOrderResponse>> {
    const response = await api.get(`/orders/${shopId}`, { params });
    return response.data;
  }
}
