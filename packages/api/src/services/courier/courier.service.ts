import { api } from "../../api";
import { IData, IPaginatedData } from "../../utils/interfaces";
import {
  IAcceptCourierOrderResponse,
  ICourierDebts,
  ICourierHistoryParams,
  ICourierOrder,
  ICourierOrderDetail,
  ICourierProfile,
  ICourierStats,
  IUpdateCourierOrderStatusResponse,
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

  static async getHistory(
    params?: ICourierHistoryParams
  ): Promise<IPaginatedData<ICourierOrderDetail>> {
    const response = await api.get(`/courier/orders/history`, { params });
    return response.data;
  }

  static async getStats(from: string, to: string): Promise<IData<ICourierStats>> {
    const response = await api.get(`/courier/stats`, {
      params: { from, to },
    });
    return response.data;
  }

  static async updateOrderStatus(
    shopId: string,
    orderId: string,
    status: string
  ): Promise<IUpdateCourierOrderStatusResponse> {
    const response = await api.put(
      `/courier/orders/${shopId}/${orderId}/status`,
      { status }
    );
    return response.data;
  }

  static async acceptOrder(
    shopId: string,
    orderId: string,
    etaMinutes: number
  ): Promise<IAcceptCourierOrderResponse> {
    const response = await api.put(
      `/courier/orders/${shopId}/${orderId}/accept`,
      { eta_minutes: etaMinutes }
    );
    return response.data;
  }

  static async getDebts(): Promise<IData<ICourierDebts>> {
    const response = await api.get(`/courier/debts`);
    return response.data;
  }
}
