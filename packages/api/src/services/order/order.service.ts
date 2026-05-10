import { IData, IPaginatedData } from "../../utils/interfaces";
import { api } from "../../api";
import {
  IOrderCreateRequest,
  IOrderParams,
  IOrderPaymentLinkResponse,
  IOrderResponse,
} from "./order.interface";

export class OrderService {
  static async createOrder(
    shopId: string,
    order: IOrderCreateRequest
  ): Promise<IData<IOrderResponse>> {
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

  static async getOrder(
    shopId: string,
    orderId: string
  ): Promise<IData<IOrderResponse>> {
    const response = await api.get(`/orders/${shopId}/user/${orderId}`);
    return response.data;
  }

  static async getOrderPaymentLink(
    shopId: string,
    orderId: string,
    params?: { return_url?: string; locale?: "uz" | "ru" | "en" }
  ): Promise<IData<IOrderPaymentLinkResponse>> {
    const response = await api.get(
      `/orders/${shopId}/${orderId}/payment-link`,
      { params }
    );
    return response.data;
  }
}
