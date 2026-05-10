export enum DeliveryMethodStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Deleted = "DELETED",
}

export enum DeliveryMethodDeliveryType {
  Fixed = "FIXED",
  Dynamic = "DYNAMIC",
  Free = "FREE",
  Custom = "CUSTOM",
}

export enum DeliveryMethodType {
  Pickup = "PICKUP",
  Delivery = "DELIVERY",
}

export enum DeliveryMethodEstimatedDayPrefix {
  Min = "MINUTE",
  Day = "DAY",
  Hour = "HOUR",
}

export enum DeliveryMethodPricingMode {
  PerKm = "PER_KM",
  FlatAfterThreshold = "FLAT_AFTER_THRESHOLD",
}

export enum DeliveryCalculationReason {
  OutOfZone = "OUT_OF_ZONE",
  ShopAddressMissing = "SHOP_ADDRESS_MISSING",
  RoutingUnavailable = "ROUTING_UNAVAILABLE",
}
