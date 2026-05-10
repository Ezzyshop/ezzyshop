import {
  PaymentMethodStatus,
  PaymentMethodType,
  PaymentProviderMode,
} from "./payment-method.enum";

export interface IPaymentMethodResponse {
  _id: string;
  shop: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  type: PaymentMethodType;
  click_config?: IClickConfig;
  click_telegram_config?: IClickTelegramConfig;
  payme_config?: IPaymeConfig;
  instructions: {
    uz: string | null;
    ru: string | null;
    en: string | null;
  };
  status: PaymentMethodStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IClickConfig {
  service_id: string;
  merchant_id: string;
  merchant_user_id: string;
  secret_key: string;
  mode: PaymentProviderMode;
}

export interface IClickTelegramConfig {
  telegram_provider_token: string | null;
}

export interface IPaymeConfig {
  merchant_id: string;
  test_key: string;
  prod_key: string;
  mode: PaymentProviderMode;
}
