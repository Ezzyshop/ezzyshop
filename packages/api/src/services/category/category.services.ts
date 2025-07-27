import { api } from "../../api";
import { ICategoriesResponse, ICategoryParams } from "./category.interface";
import { IPaginatedData } from "../../utils/interfaces";

export class CategoriesService {
  static async getCategories(
    shopId: string,
    params?: ICategoryParams
  ): Promise<IPaginatedData<ICategoriesResponse>> {
    const response = await api.get(`/categories/${shopId}/with-products`, {
      params,
    });
    return response.data;
  }
}
