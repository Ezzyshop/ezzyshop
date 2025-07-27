import { ILocale } from "@/src/utils/interfaces/base.interface";

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
  page: number;
  limit: number;
  search: string;
}