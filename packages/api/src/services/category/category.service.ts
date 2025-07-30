import { api } from "../../api";
import {
  ICategoriesResponse,
  ICategoryParams,
  ICategoryResponse,
} from "./category.interface";
import { IPaginatedData } from "../../utils/interfaces/index";
import { IData } from "@/src/utils/interfaces/base.interface.js";

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

  static async getCategory(
    shopId: string,
    categoryId: string,
    params?: Record<string, string | number | boolean>
  ): Promise<IData<ICategoryResponse>> {
    const response = await api.get(`/categories/${shopId}/${categoryId}`, {
      params,
    });
    return response.data;
  }
}
