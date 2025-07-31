import { api } from "@repo/api/api";
import { IPaginatedData, IData } from "@repo/api/utils/interfaces";
import {
  IProductParams,
  IProductResponse,
  ProductByCategoryType,
} from "@repo/api/services/products";

export class ProductService {
  static async getProductsByCategory(
    shopId: string,
    type: ProductByCategoryType,
    filter?: IProductParams
  ): Promise<IPaginatedData<IProductResponse>> {
    const response = await api.get(`/products/${shopId}/${type}`, {
      params: filter,
    });
    return response.data;
  }

  static async getProductById(
    shopId: string,
    productId: string
  ): Promise<IData<IProductResponse>> {
    const response = await api.get(`/products/${shopId}/${productId}`);
    return response.data;
  }
}
