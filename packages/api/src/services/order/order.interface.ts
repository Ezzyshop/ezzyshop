export interface IOrderCreateRequest {
  product: {
    product: string;
    variant: string | null;
    quantity: number;
  }[];
  payment_method: string;
  delivery_method?: string;
  delivery_address?: {
    address: string;
    lat: number;
    lng: number;
  };
  pickup_address?: string;
  customer_info: {
    name: string;
    phone: string;
  };
  notes?: string;
}
