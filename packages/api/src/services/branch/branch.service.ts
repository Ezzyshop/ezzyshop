import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import { IBranchResponse } from "./branch.interface";

export class BranchService {
  static async getPublicBranches(shopId: string): Promise<IBranchResponse[]> {
    const response = await api.get<IData<IBranchResponse[]>>(
      `/branches/public/${shopId}`
    );
    return response.data.data;
  }
}
