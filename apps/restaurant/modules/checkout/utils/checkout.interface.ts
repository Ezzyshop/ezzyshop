export interface ICheckoutDeliveryForm {
  customer_info: {
    name: string;
    phone: string;
  };
  address: string;
  delivery_method: string;
  payment_method: string;
  note?: string;
}

export interface ICheckoutPickupForm {
  customer_info: {
    name: string;
    phone: string;
  };
  branch: string;
  payment_method: string;
  note?: string;
}

export type ICheckoutForm = ICheckoutDeliveryForm | ICheckoutPickupForm;
