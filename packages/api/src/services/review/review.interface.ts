import { ILocale } from '../../utils/interfaces/base.interface';

export interface IReviewResponse {
  _id: string;
  user: {
    _id: string;
    full_name: string;
  };
  product: {
    _id: string;
    name: ILocale;
    main_image: string;
  };
  shop: string;
  order: string;
  rating: number;
  message?: string;
  images: string[];
  reply?: string;
  reply_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewCreateItem {
  productId: string;
  orderId: string;
  rating: number;
  message?: string;
  images?: string[];
}

export interface IReviewCreateRequest {
  products: IReviewCreateItem[];
}

export interface IReviewParams {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface IUnreviewedProduct {
  orderId: string;
  orderDate?: string;
  product: {
    _id: string;
    name: ILocale;
    main_image: string;
  };
}

export interface IOrderProductWithReview {
  orderId: string;
  orderDate?: string;
  product: {
    _id: string;
    name: ILocale;
    main_image: string;
  };
  review: IReviewResponse | null;
}
