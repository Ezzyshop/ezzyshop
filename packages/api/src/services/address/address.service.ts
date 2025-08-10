import { api } from "../../api";
import { IAddressResponse } from "./address.interface";
import { IData } from "../../utils/interfaces";

export class AddressService {
  static async getAddresses(): Promise<IData<IAddressResponse[]>> {
    const response = await api.get<IData<IAddressResponse[]>>("/addresses");
    return response.data;
  }
}
