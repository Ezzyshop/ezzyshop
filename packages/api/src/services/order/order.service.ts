import { api } from "../../api";
import { IOrderCreateRequest } from "./order.interface";

export class OrderService {
  static async createOrder(shopId: string, order: IOrderCreateRequest) {
    const response = await api.post(`/orders/${shopId}`, order);
    return response.data;
  }
}
