export interface ICourierShop {
  _id: string;
  name: string;
}

export interface ICourierProfile {
  _id: string;
  full_name: string;
  phone: string;
  photo: string | null;
  shops: ICourierShop[];
  total_earnings: number;
  today_earnings: number;
  completed_count: number;
  currency_symbol: string;
  penalty_count: number;
  blocked_until: string | null;
  block_count: number;
}

export interface ICourierReportDay {
  date: string;
  earnings: number;
  count: number;
}

export interface ICourierStatsTotals {
  earnings: number;
  orders: number;
  /** Collected by the courier in cash */
  cash_earnings: number;
  /** Paid online — collected by the shop, becomes courier debt */
  online_earnings: number;
  avg_per_order: number;
  avg_per_active_day: number;
  active_days: number;
  best_day: { date: string; earnings: number } | null;
}

export interface ICourierStatsTiming {
  /** null when no order in the range carries the underlying data */
  avg_accept_seconds: number | null;
  avg_delivery_seconds: number | null;
  on_time_count: number;
  late_count: number;
  on_time_rate: number | null;
}

export interface ICourierShopStat {
  shop_id: string;
  shop_name: string;
  orders: number;
  earnings: number;
  cash_earnings: number;
  online_earnings: number;
  late_count: number;
  avg_delivery_seconds: number | null;
  debt_balance: number;
  share_pct: number;
}

export interface ICourierStats {
  from: string;
  to: string;
  currency_symbol: string;
  totals: ICourierStatsTotals;
  timing: ICourierStatsTiming;
  debts: { total_balance: number };
  days: ICourierReportDay[];
  shops: ICourierShopStat[];
}

export interface ICourierHistoryParams {
  from?: string;
  to?: string;
  shopId?: string;
  page?: number;
  limit?: number;
}

export interface ICourierOrderProduct {
  name: string;
  quantity: number;
}

export interface ICourierOrder {
  orderId: string;
  shopId: string;
  shop_name?: string;
  total_price: number;
  delivery_price: number;
  total_quantity: number;
  currency_symbol: string;
  payment_method_type: string;
  customer_info: {
    name: string;
    phone: string;
  };
  delivery_address?: {
    address: string;
    lat: number;
    lng: number;
  };
  products: ICourierOrderProduct[];
  createdAt?: string;
}

export interface ICourierOrderClaimed {
  orderId: string;
  shopId: string;
  courierId: string;
  courierName: string;
}

export interface IAcceptCourierOrderResponse {
  message: string;
  data: unknown;
  already_accepted: boolean;
}

export interface ICourierOrderDetailProduct {
  name: string;
  quantity: number;
  total_price: number;
  image?: string;
}

export interface ICourierDebtShop {
  shop_id: string;
  shop_name: string;
  balance: number;
}

export interface ICourierDebts {
  total_balance: number;
  debts: ICourierDebtShop[];
}

export interface ICourierPenalty {
  penalized: boolean;
  penalty_count: number;
  penalties_left: number;
  blocked: boolean;
  blocked_until: string | null;
}

export interface IUpdateCourierOrderStatusResponse {
  message: string;
  data: unknown;
  penalty: ICourierPenalty | null;
}

export interface ICourierOrderDetail {
  orderId: string;
  shopId: string;
  shop_name?: string;
  status: string;
  total_price: number;
  total_quantity: number;
  total_discount: number;
  delivery_price: number;
  currency_symbol: string;
  payment_method_type: string;
  customer_info: {
    name: string;
    phone: string;
  };
  delivery_address?: {
    address: string;
    lat: number;
    lng: number;
  };
  products: ICourierOrderDetailProduct[];
  notes?: string;
  createdAt?: string;
  accepted_at?: string;
  updatedAt?: string;
  completed_at?: string;
  courier_eta_minutes?: number;
  courier_deadline_at?: string;
  courier_arrived_at?: string;
}
