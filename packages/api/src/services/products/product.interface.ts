import { ILocale } from "@/src/utils/interfaces/base.interface";
import { ProductStatus } from "./product.enum";

export interface IProductResponse {
  name: ILocale;
  description: ILocale;
  _id: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  categories: {
    _id: string;
    name: ILocale;
  }[];
  variants: {
    sku: string;
    attributes: Record<string, string>;
    price: number;
    quantity: number;
    image: string;
    _id: string;
  }[];
  shop: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
  views: number;
}

export interface IProductParams {
  page?: number;
  limit?: number;
  search?: string;
}
