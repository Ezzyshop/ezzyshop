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
}

export interface ICourierOrderProduct {
  name: string;
  quantity: number;
}

export interface ICourierOrder {
  orderId: string;
  shopId: string;
  total_price: number;
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
