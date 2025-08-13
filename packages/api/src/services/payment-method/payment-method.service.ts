import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import { IPaymentMethodResponse } from "./payment-method.interface";

export class PaymentMethodService {
  static async getPublicPaymentMethods(
    shopId: string
  ): Promise<IPaymentMethodResponse[]> {
    const response = await api.get<IData<IPaymentMethodResponse[]>>(
      `/payment-methods/public/${shopId}`
    );
    return response.data.data;
  }
}
