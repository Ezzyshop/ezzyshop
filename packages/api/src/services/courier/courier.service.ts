import { api } from "../../api";
import { IData } from "../../utils/interfaces";
import {
  IAcceptCourierOrderResponse,
  ICourierOrder,
  ICourierOrderDetail,
  ICourierProfile,
  ICourierReport,
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

  static async getActiveOrders(): Promise<IData<ICourierOrderDetail[]>> {
    const response = await api.get(`/courier/orders/active`);
    return response.data;
  }

  static async getOrderDetail(
    shopId: string,
    orderId: string
  ): Promise<IData<ICourierOrderDetail>> {
    const response = await api.get(`/courier/orders/${shopId}/${orderId}`);
    return response.data;
  }

  static async getHistory(): Promise<IData<ICourierOrderDetail[]>> {
    const response = await api.get(`/courier/orders/history`);
    return response.data;
  }

  static async getReport(
    from: string,
    to: string
  ): Promise<IData<ICourierReport>> {
    const response = await api.get(`/courier/report`, {
      params: { from, to },
    });
    return response.data;
  }

  static async updateOrderStatus(
    shopId: string,
    orderId: string,
    status: string
  ): Promise<IData<unknown>> {
    const response = await api.put(
      `/courier/orders/${shopId}/${orderId}/status`,
      { status }
    );
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
