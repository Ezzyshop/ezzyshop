import { IPaymentMethodResponse, PaymentMethodType } from "../payment-method";
import {
  TransactionChequeImageStatus,
  TransactionStatus,
} from "../transaction/transaction.enum";
import { OrderStatus } from "./order.enum";

export interface IOrderCreateRequest {
  product: {
    product: string;
    variant: string | null;
    quantity: number;
  }[];
  payment_method: string;
  delivery_method?: string;
  delivery_address?: {
    address: string;
    lat: number;
    lng: number;
  };
  pickup_address?: string;
  customer_info: {
    name: string;
    phone: string;
  };
  notes?: string;
}

export interface IOrderResponse {
  _id: string;
  status: OrderStatus;
  createdAt: string;
  customer_info: {
    name: string;
    phone: string;
  };
  total_quantity: number;
  total_price: number;
  delivery_method?: {
    _id: string;
    price: number;
  };
  delivery_address?: {
    address: string;
    lat: number;
    lng: number;
    _id: string;
  };
  pickup_address?: {
    address: string;
    lat: number;
    lng: number;
    _id: string;
  };
  products: IOrderProduct[];
  transaction: {
    _id: string;
    status: TransactionStatus;
    cheque_images: {
      url: string;
      status: TransactionChequeImageStatus;
    }[];
    provider: IPaymentMethodResponse;
  };
}

export interface IOrderProduct {
  _id: string;
  price: number;
  compare_at_price?: number;
  product: {
    _id: string;
    name: {
      uz: string;
      ru: string;
      en: string;
    };
    images: string[];
  };
  quantity: number;
  total_price: number;
  variant?: {
    attributes: Record<string, string>;
    name: {
      uz: string;
      ru: string;
      en: string;
    };
    _id: string;
  };
}

export interface IOrderParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}
