export interface ICheckoutForm {
  product: {
    product: string;
    variant: string | null;
    quantity: number;
  }[];
  customer_info: {
    name: string;
    phone: string;
  };
  delivery_address: {
    _id: string;
    address: string;
    lat: number;
    lng: number;
  };
  delivery_method: string;
  payment_method: string;
  pickup_address?: string;
  pickup_location_and_delivery_method?: string;
  notes?: string;
  telegram_chat_id?: string;
}
