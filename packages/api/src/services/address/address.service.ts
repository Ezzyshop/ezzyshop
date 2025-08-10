import { api } from "../../api";
import { IAddressRequest, IAddressResponse } from "./address.interface";
import { IData } from "../../utils/interfaces";

export class AddressService {
  static async getAddresses(): Promise<IData<IAddressResponse[]>> {
    const response = await api.get<IData<IAddressResponse[]>>("/addresses");
    return response.data;
  }

  static async createAddress(
    data: IAddressRequest
  ): Promise<IData<IAddressResponse>> {
    const response = await api.post<IData<IAddressResponse>>(
      "/addresses",
      data
    );
    return response.data;
  }

  static async deleteAddress(id: string): Promise<IData<IAddressResponse>> {
    const response = await api.delete<IData<IAddressResponse>>(
      `/addresses/${id}`
    );
    return response.data;
  }
}
