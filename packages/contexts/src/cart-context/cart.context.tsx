"use client";
import { IProductResponse } from "@repo/api/services/products/index";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  PropsWithChildren,
} from "react";
import {
  CartAction,
  ICartItem,
  ICartState,
  calculateTotals,
  generateCartItemId,
  calculateItemPrice,
  IOutOfStockItem,
} from "./utils";
import { UserContext } from "../user-context/user.context";
import { CartService, ICartSyncItem } from "@repo/api/services/cart/index";
import {
  CartAnalyticsService,
  IGA4Item,
} from "@repo/api/services/cart-analytics/index";

const initialState: ICartState = {
  items: [],
  isLoading: true,
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
  totalPriceWithoutDiscount: 0,
};

const CART_STORAGE_KEY = (shopId: string) => `${shopId}-cart`;
const SYNC_DEBOUNCE_MS = 600;

const cartReducer = (state: ICartState, action: CartAction): ICartState => {
  switch (action.type) {
    case "LOAD_CART": {
      const totals = calculateTotals(action.payload);
      return { ...state, items: action.payload, ...totals, isLoading: false };
    }

    case "SET_LOADING": {
      return { ...state, isLoading: action.payload };
    }

    case "ADD_ITEM": {
      const { product, variant, quantity = 1 } = action.payload;
      const itemId = generateCartItemId(product._id, variant?._id);
      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      let newItems: ICartItem[];

      if (existingIndex >= 0) {
        newItems = state.items.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        const newItem: ICartItem = {
          id: itemId,
          product,
          variant,
          quantity,
          addedAt: Date.now(),
          isOutOfStock: false,
        };
        newItems = [...state.items, newItem];
      }

      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id,
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } });
      }
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        totalDiscount: 0,
        totalPriceWithoutDiscount: 0,
      };
    }

    case "SET_OUT_OF_STOCK_ITEMS": {
      const newItems = state.items.map((item) =>
        action.payload.some(
          (o) =>
            o.productId === item.product._id &&
            o.variantId === item.variant?._id,
        )
          ? { ...item, isOutOfStock: true }
          : item,
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    default:
      return state;
  }
};

export interface ICartContext extends ICartState {
  shopId: string;
  addItem: (
    product: IProductResponse,
    variant?: IProductResponse["variants"][number],
    quantity?: number,
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId?: string) => number;
  isItemInCart: (productId: string, variantId?: string) => boolean;
  getCartItemPrice: (item: ICartItem) => number;
  setOutOfStockItems: (items: IOutOfStockItem[]) => void;
  trackViewCart: (currency: string) => void;
  trackBeginCheckout: (currency: string) => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCart = (): ICartContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const toSyncItems = (items: ICartItem[]): ICartSyncItem[] =>
  items.map((item) => ({
    product: item.product._id,
    variant: item.variant?._id ?? null,
    quantity: item.quantity,
    addedAt: item.addedAt,
  }));

const toGA4Items = (items: ICartItem[], locale: string): IGA4Item[] =>
  items.map((item) => ({
    item_id: item.product._id,
    item_name:
      item.product.name[locale as "uz" | "ru" | "en"] ?? item.product.name.uz,
    price: item.variant?.price ?? 0,
    quantity: item.quantity,
  }));

export const CartProvider: React.FC<PropsWithChildren & { shopId: string }> = ({
  children,
  shopId,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDoneRef = useRef(false);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY(shopId));
        const localItems: ICartItem[] = saved ? JSON.parse(saved) : [];

        if (user) {
          // Authenticated: fetch backend cart, merge with localStorage
          try {
            const { data } = await CartService.getCart(shopId);
            const backendItems = data.items as unknown as ICartItem[];

            if (backendItems.length > 0 && localItems.length === 0) {
              // New device — use backend cart
              dispatch({ type: "LOAD_CART", payload: backendItems });
            } else if (localItems.length > 0) {
              // Local cart exists — merge: local wins (more recent session activity)
              const merged = [...localItems];
              backendItems.forEach((backendItem) => {
                const alreadyExists = merged.some(
                  (l) => l.id === backendItem.id,
                );
                if (!alreadyExists) merged.push(backendItem);
              });
              dispatch({ type: "LOAD_CART", payload: merged });
            } else {
              dispatch({ type: "LOAD_CART", payload: [] });
            }
          } catch {
            // Backend unreachable — fall back to localStorage
            dispatch({ type: "LOAD_CART", payload: localItems });
          }
        } else {
          dispatch({ type: "LOAD_CART", payload: localItems });
        }
      } catch {
        dispatch({ type: "SET_LOADING", payload: false });
      } finally {
        initialLoadDoneRef.current = true;
      }
    };

    load();
    // Re-run only when shopId or user identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, user?._id]);

  // ── Persist to localStorage ───────────────────────────────────────────────
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY(shopId),
          JSON.stringify(state.items),
        );
      } catch {
        // localStorage full — ignore
      }
    }
  }, [state.items, state.isLoading, shopId]);

  // ── Debounced backend sync ────────────────────────────────────────────────
  useEffect(() => {
    if (!initialLoadDoneRef.current || state.isLoading || !user) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    syncTimerRef.current = setTimeout(() => {
      CartService.syncCart(shopId, toSyncItems(state.items)).catch(() => {});
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [state.items, state.isLoading, shopId, user]);

  // ── Action handlers ───────────────────────────────────────────────────────
  const addItem = useCallback(
    (
      product: IProductResponse,
      variant?: IProductResponse["variants"][number],
      quantity = 1,
    ) => {
      dispatch({ type: "ADD_ITEM", payload: { product, variant, quantity } });

      CartAnalyticsService.trackAddToCart(shopId, {
        productId: product._id,
        variantId: variant?._id,
        productName: product.name.uz,
        price: variant?.price ?? product.variants[0]?.price ?? 0,
        quantity,
        currency: "UZS",
      });
    },
    [shopId],
  );

  const removeItem = useCallback(
    (id: string) => {
      const item = state.items.find((i) => i.id === id);
      dispatch({ type: "REMOVE_ITEM", payload: { id } });

      if (item) {
        CartAnalyticsService.trackRemoveFromCart(shopId, {
          productId: item.product._id,
          variantId: item.variant?._id,
          productName: item.product.name.uz,
          price: item.variant?.price ?? 0,
          quantity: item.quantity,
          currency: "UZS",
        });
      }
    },
    [shopId, state.items],
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    if (user) {
      CartService.clearCart(shopId).catch(() => {});
    }
  }, [shopId, user]);

  const getItemQuantity = useCallback(
    (productId: string, variantId?: string): number => {
      const itemId = generateCartItemId(productId, variantId);
      return state.items.find((item) => item.id === itemId)?.quantity ?? 0;
    },
    [state.items],
  );

  const isItemInCart = useCallback(
    (productId: string, variantId?: string): boolean =>
      getItemQuantity(productId, variantId) > 0,
    [getItemQuantity],
  );

  const getCartItemPrice = useCallback(
    (item: ICartItem): number => calculateItemPrice(item),
    [],
  );

  const setOutOfStockItems = useCallback((items: IOutOfStockItem[]) => {
    dispatch({ type: "SET_OUT_OF_STOCK_ITEMS", payload: items });
  }, []);

  const trackViewCart = useCallback(
    (currency: string) => {
      CartAnalyticsService.trackViewCart(shopId, {
        value: state.totalPrice,
        currency,
        items: toGA4Items(state.items, "uz"),
      });
    },
    [shopId, state.totalPrice, state.items],
  );

  const trackBeginCheckout = useCallback(
    (currency: string) => {
      CartAnalyticsService.trackBeginCheckout(shopId, {
        value: state.totalPrice,
        currency,
        items: toGA4Items(state.items, "uz"),
      });
    },
    [shopId, state.totalPrice, state.items],
  );

  const contextValue: ICartContext = {
    ...state,
    shopId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
    getCartItemPrice,
    setOutOfStockItems,
    trackViewCart,
    trackBeginCheckout,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export type { CartAction };
