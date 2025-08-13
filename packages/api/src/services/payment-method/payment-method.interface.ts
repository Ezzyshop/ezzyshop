import { PaymentMethodStatus, PaymentMethodType } from "./payment-method.enum";

export interface IPaymentMethodResponse {
  _id: string;
  shop: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  type: PaymentMethodType;
  click_config: IClickPaymentMethodConfig;
  instructions: {
    uz: string | null;
    ru: string | null;
    en: string | null;
  };
  status: PaymentMethodStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IClickPaymentMethodConfig {
  merchant_id: string;
  service_id: string;
  merchant_user_id: string | null;
  secret_key: string;
}
