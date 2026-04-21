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
