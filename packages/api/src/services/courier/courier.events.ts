// Socket event names — must match the backend (src/modules/courier/utils/courier.helper.ts)
export const COURIER_ORDER_NEW = "courier:order:new";
export const COURIER_ORDER_CLAIMED = "courier:order:claimed";

// Cash payment method type — matches backend PaymentMethodType.Cash
export const PAYMENT_METHOD_CASH = "CASH";

// Order statuses relevant to couriers — matches backend OrderStatus
export enum CourierOrderStatus {
  Processing = "PROCESSING",
  CourierInShop = "COURIER_IN_SHOP",
  Delivering = "DELIVERING",
  Completed = "COMPLETED",
}
