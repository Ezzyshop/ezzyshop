import { ProductByCategoryType } from "./product.type";
import { IProductResponse } from "./product.interface";
import { api } from "../../api";
import { IPaginatedData } from "@/src/utils/interfaces/base.interface";
import { IProductParams } from "./product.interface";

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
}
