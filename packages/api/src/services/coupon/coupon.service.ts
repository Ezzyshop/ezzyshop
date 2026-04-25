import { api } from '../../api';
import { IData } from '../../utils/interfaces';
import { ICouponApplyRequest, ICouponApplyResponse, IMyCoupon } from './coupon.interface';

export class CouponService {
  static async apply(shopId: string, data: ICouponApplyRequest): Promise<IData<ICouponApplyResponse>> {
    const response = await api.post(`/coupons/${shopId}/apply`, data);
    return response.data;
  }

  static async getMyCoupons(shopId: string): Promise<IData<IMyCoupon[]>> {
    const response = await api.get(`/coupons/${shopId}/my-coupons`);
    return response.data;
  }
}
