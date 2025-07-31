import { IData, IPaginatedData } from "@repo/api/utils/interfaces";
import { api } from "../../api";
import { IProductParams, IProductResponse } from "./product.interface";
import { ProductByCategoryType } from "./product.type";

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
