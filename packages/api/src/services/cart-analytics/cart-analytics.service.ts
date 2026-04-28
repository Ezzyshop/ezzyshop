import axios from 'axios';

const silentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9100',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export enum CartEventType {
  AddToCart = 'add_to_cart',
  RemoveFromCart = 'remove_from_cart',
  ViewCart = 'view_cart',
  BeginCheckout = 'begin_checkout',
  Purchase = 'purchase',
}

export interface ICartEventPayload {
  event: CartEventType;
  product?: string;
  variant_id?: string;
  quantity?: number;
  value?: number;
  order_id?: string;
  session_id?: string;
}

export interface IGA4Item {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export class CartAnalyticsService {
  static async track(shopId: string, payload: ICartEventPayload): Promise<void> {
    // Fire-and-forget to backend — never throws so it never disrupts UX
    silentApi.post(`/cart-events/${shopId}`, payload).catch(() => {});
  }

  static fireGA4(eventName: string, params: Record<string, unknown>): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  static fireFBPixel(eventName: string, params: Record<string, unknown>): void {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', eventName, params);
    }
  }

  static trackAddToCart(
    shopId: string,
    opts: {
      productId: string;
      variantId?: string;
      productName: string;
      price: number;
      quantity: number;
      currency: string;
    },
  ): void {
    const value = opts.price * opts.quantity;

    CartAnalyticsService.track(shopId, {
      event: CartEventType.AddToCart,
      product: opts.productId,
      variant_id: opts.variantId,
      quantity: opts.quantity,
      value,
    });

    CartAnalyticsService.fireGA4('add_to_cart', {
      currency: opts.currency,
      value,
      items: [{ item_id: opts.productId, item_name: opts.productName, price: opts.price, quantity: opts.quantity }],
    });

    CartAnalyticsService.fireFBPixel('AddToCart', {
      content_ids: [opts.productId],
      content_name: opts.productName,
      value,
      currency: opts.currency,
    });
  }

  static trackRemoveFromCart(
    shopId: string,
    opts: {
      productId: string;
      variantId?: string;
      productName: string;
      price: number;
      quantity: number;
      currency: string;
    },
  ): void {
    const value = opts.price * opts.quantity;

    CartAnalyticsService.track(shopId, {
      event: CartEventType.RemoveFromCart,
      product: opts.productId,
      variant_id: opts.variantId,
      quantity: opts.quantity,
      value,
    });

    CartAnalyticsService.fireGA4('remove_from_cart', {
      currency: opts.currency,
      value,
      items: [{ item_id: opts.productId, item_name: opts.productName, price: opts.price, quantity: opts.quantity }],
    });
  }

  static trackViewCart(
    shopId: string,
    opts: {
      value: number;
      currency: string;
      items: IGA4Item[];
    },
  ): void {
    CartAnalyticsService.track(shopId, {
      event: CartEventType.ViewCart,
      value: opts.value,
    });

    CartAnalyticsService.fireGA4('view_cart', {
      currency: opts.currency,
      value: opts.value,
      items: opts.items,
    });
  }

  static trackBeginCheckout(
    shopId: string,
    opts: {
      value: number;
      currency: string;
      items: IGA4Item[];
    },
  ): void {
    CartAnalyticsService.track(shopId, {
      event: CartEventType.BeginCheckout,
      value: opts.value,
    });

    CartAnalyticsService.fireGA4('begin_checkout', {
      currency: opts.currency,
      value: opts.value,
      items: opts.items,
    });

    CartAnalyticsService.fireFBPixel('InitiateCheckout', {
      value: opts.value,
      currency: opts.currency,
      num_items: opts.items.reduce((s, i) => s + i.quantity, 0),
    });
  }

  static trackPurchase(
    shopId: string,
    opts: {
      orderId: string;
      value: number;
      currency: string;
      items: IGA4Item[];
    },
  ): void {
    CartAnalyticsService.track(shopId, {
      event: CartEventType.Purchase,
      order_id: opts.orderId,
      value: opts.value,
    });

    CartAnalyticsService.fireGA4('purchase', {
      transaction_id: opts.orderId,
      currency: opts.currency,
      value: opts.value,
      items: opts.items,
    });

    CartAnalyticsService.fireFBPixel('Purchase', {
      value: opts.value,
      currency: opts.currency,
    });
  }
}
