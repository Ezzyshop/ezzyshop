export enum PaymentMethodType {
  Click = "CLICK",
  ClickTelegram = "CLICK_TELEGRAM",
  Payme = "PAYME",
  CardTransfer = "CARD_TRANSFER",
  Cash = "CASH",
}

export enum PaymentMethodStatus {
  Active = "ACTIVE",
  Waiting = "WAITING",
  Inactive = "INACTIVE",
}

export enum PaymentProviderMode {
  Test = "TEST",
  Production = "PRODUCTION",
}
