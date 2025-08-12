import {
  DeliveryMethodDeliveryType,
  DeliveryMethodEstimatedDayPrefix,
  DeliveryMethodStatus,
  DeliveryMethodType,
} from "./delivery-method.enum";

export interface IDeliveryMethodResponse {
  _id: string;
  shop: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  estimated_days: number;
  pickup_location?: string;
  estimated_day_prefix: DeliveryMethodEstimatedDayPrefix;
  type: DeliveryMethodType;
  status: DeliveryMethodStatus;
  deliveryType?: DeliveryMethodDeliveryType;
  price: number;
  initial_km?: number;
  initial_km_price?: number;
  every_km_price?: number;
  min_order_price?: number;
}

export interface IDeliveryMethodParams {
  type?: DeliveryMethodType;
}
