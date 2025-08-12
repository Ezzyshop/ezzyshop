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
