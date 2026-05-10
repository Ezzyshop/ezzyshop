import {
  DeliveryCalculationReason,
  DeliveryMethodDeliveryType,
  DeliveryMethodEstimatedDayPrefix,
  DeliveryMethodPricingMode,
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
  dynamic_pricing_mode?: DeliveryMethodPricingMode;
}

export interface IDeliveryMethodParams {
  type?: DeliveryMethodType;
}

export interface IDeliveryCalculationResponse {
  delivery_method_id: string;
  in_zone: boolean;
  applicable: boolean;
  distance_km: number | null;
  price: number;
  reason?: DeliveryCalculationReason;
}
