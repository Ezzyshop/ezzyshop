import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import {
  IDeliveryMethodParams,
  IDeliveryMethodResponse,
} from "./delivery-method.interface";

export class DeliveryMethodService {
  static async getDeliveryMethods(
    shopId: string,
    filter?: IDeliveryMethodParams
  ): Promise<IDeliveryMethodResponse[]> {
    const response = await api.get<IData<IDeliveryMethodResponse[]>>(
      `/delivery-methods/${shopId}`,
      {
        params: filter,
      }
    );
    return response.data.data;
  }
}
