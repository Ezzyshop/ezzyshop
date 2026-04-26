import { IData, IPaginatedData } from '../../utils/interfaces';
import { api } from '../../api';
import { IOrderProductWithReview, IReviewCreateRequest, IReviewParams, IReviewResponse, IUnreviewedProduct } from './review.interface';

export class ReviewService {
  static async createReviews(shopId: string, body: IReviewCreateRequest): Promise<IData<IReviewResponse[]>> {
    const response = await api.post(`/reviews/${shopId}`, body);
    return response.data;
  }

  static async getProductReviews(productId: string, params?: IReviewParams): Promise<IPaginatedData<IReviewResponse>> {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  }

  static async getMyOrderReviews(orderId: string): Promise<IData<IReviewResponse[]>> {
    const response = await api.get(`/reviews/my-order/${orderId}`);
    return response.data;
  }

  static async getUnreviewedProducts(shopId: string): Promise<IData<IUnreviewedProduct[]>> {
    const response = await api.get(`/reviews/unreviewed/${shopId}`);
    return response.data;
  }

  static async getMyOrderProductsWithReviews(shopId: string): Promise<IData<IOrderProductWithReview[]>> {
    const response = await api.get(`/reviews/my-products/${shopId}`);
    return response.data;
  }
}
