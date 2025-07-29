import { api } from "../../api";
import { ICategoriesResponse, ICategoryParams } from "./category.interface";
import { IPaginatedData } from "../../utils/interfaces/index";

export class CategoriesService {
  static async getPublicCategories(
    shopId: string,
    params?: ICategoryParams
  ): Promise<IPaginatedData<ICategoriesResponse>> {
    const response = await api.get(`/categories/${shopId}/public`, {
      params,
    });
    return response.data;
  }

  static async getCategoriesWithProducts(
    shopId: string,
    params?: ICategoryParams
  ): Promise<IPaginatedData<ICategoriesResponse>> {
    const response = await api.get(`/categories/${shopId}/with-products`, {
      params,
    });
    return response.data;
  }
}
