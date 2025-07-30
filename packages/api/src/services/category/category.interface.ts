import { ILocale } from "@/src/utils/interfaces/base.interface";
import { IPaginatedData } from "@/src/utils/interfaces/base.interface";
import { IProductResponse } from "../products/product.interface";

export interface ICategoriesResponse {
  name: ILocale;
  _id: string;
  image?: string;
  shop: {
    _id: string;
    name: string;
  };
  status: string;
  is_popular: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICategoryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_popular?: boolean;
}

export interface ICategoryResponse extends IPaginatedData<IProductResponse> {
  products: IProductResponse[];
}
