import { api } from "../../api";

export class TransactionService {
  static async sendCheque(
    shopId: string,
    transactionId: string,
    cheque_image: string
  ): Promise<void> {
    const response = await api.post(
      `/transactions/${shopId}/${transactionId}/upload-cheque-image`,
      {
        cheque_image,
      }
    );
    return response.data;
  }
}
