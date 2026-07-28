import { api } from "../../api";
import { IData } from "../../utils/interfaces";
import {
  IAcceptCourierOrderResponse,
  ICourierOrder,
  ICourierProfile,
} from "./courier.interface";

export class CourierService {
  static async getMe(): Promise<IData<ICourierProfile>> {
    const response = await api.get(`/courier/me`);
    return response.data;
  }

  static async getFeed(): Promise<IData<ICourierOrder[]>> {
    const response = await api.get(`/courier/orders`);
    return response.data;
  }

  static async acceptOrder(
    shopId: string,
    orderId: string
  ): Promise<IAcceptCourierOrderResponse> {
    const response = await api.put(
      `/courier/orders/${shopId}/${orderId}/accept`
    );
    return response.data;
  }
}
