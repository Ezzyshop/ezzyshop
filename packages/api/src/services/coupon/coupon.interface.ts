export interface ICouponApplyRequest {
  code: string;
  cart_total: number;
}

export interface ICouponApplyResponse {
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  discount_amount: number;
  final_total: number;
}

export interface IMyCoupon {
  _id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_price: number;
  max_uses: number | null;
  max_uses_per_user: number | null;
  used_count: number;
  expires_at: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}
