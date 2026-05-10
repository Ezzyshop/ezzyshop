import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import {
  IDeliveryCalculationResponse,
  IDeliveryMethodParams,
  IDeliveryMethodResponse,
} from "./delivery-method.interface";

export class DeliveryMethodService {
  static async getDeliveryMethods(
    shopId: string,
    filter?: IDeliveryMethodParams
  ): Promise<IDeliveryMethodResponse[]> {
    const response = await api.get<IData<IDeliveryMethodResponse[]>>(
      `/delivery-methods/public/${shopId}`,
      {
        params: filter,
      }
    );
    return response.data.data;
  }

  static async getDeliveryMethod(
    shopId: string,
    deliveryMethodId: string
  ): Promise<IDeliveryMethodResponse> {
    const response = await api.get<IData<IDeliveryMethodResponse>>(
      `/delivery-methods/${shopId}/${deliveryMethodId}`
    );
    return response.data.data;
  }

  static async calculateDelivery(
    shopId: string,
    deliveryMethodId: string,
    lat: number,
    lng: number
  ): Promise<IDeliveryCalculationResponse> {
    const response = await api.post<IData<IDeliveryCalculationResponse>>(
      `/delivery-methods/public/${shopId}/calculate`,
      { delivery_method_id: deliveryMethodId, lat, lng }
    );
    return response.data.data;
  }
}
