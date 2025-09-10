import { ILocale } from "../../utils/interfaces";
import { ProductStatus } from "./product.enum";

export interface IProductResponse {
  name: ILocale;
  description: ILocale;
  _id: string;
  main_image: string;
  categories: string[];
  variants: {
    sku: string;
    attributes: Record<string, string>;
    price: number;
    compare_at_price: number | null;
    quantity: number;
    images: string[];
    _id: string;
  }[];
  shop: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
  views: number;
  delivery_time?: number;
}

export interface IProductParams {
  page?: number;
  limit?: number;
  search?: string;
}
