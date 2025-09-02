"use client";
import { IProductResponse } from "@repo/api/services/products/index";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
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
import { useParams } from "next/navigation";

const initialState: ICartState = {
  items: [],
  isLoading: true,
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
  totalPriceWithoutDiscount: 0,
};

const CART_STORAGE_KEY = (shopId: string) => `${shopId}-cart`;

const cartReducer = (state: ICartState, action: CartAction): ICartState => {
  switch (action.type) {
    case "LOAD_CART": {
      const {
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
        isLoading: false,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case "ADD_ITEM": {
      const { product, variant, quantity = 1 } = action.payload;
      const itemId = generateCartItemId(product._id, variant?._id);

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      let newItems: ICartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
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

      const {
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      const {
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } });
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const {
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      };
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
          (outOfStockItem) =>
            outOfStockItem.productId === item.product._id &&
            outOfStockItem.variantId === item.variant?._id
        )
          ? { ...item, isOutOfStock: true }
          : item
      );

      const {
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        totalDiscount,
        totalPriceWithoutDiscount,
      };
    }
    default:
      return state;
  }
};

export interface ICartContext extends ICartState {
  addItem: (
    product: IProductResponse,
    variant?: IProductResponse["variants"][number],
    quantity?: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId?: string) => number;
  isItemInCart: (productId: string, variantId?: string) => boolean;
  getCartItemPrice: (item: ICartItem) => number;
  setOutOfStockItems: (items: IOutOfStockItem[]) => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCart = (): ICartContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const { shopId } = useParams();

  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY(shopId));
        if (savedCart) {
          const parsedCart: ICartItem[] = JSON.parse(savedCart);
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadCartFromStorage();
  }, [shopId]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY(shopId),
          JSON.stringify(state.items)
        );
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [state.items, state.isLoading, shopId]);

  // Action handlers
  const addItem = (
    product: IProductResponse,
    variant?: IProductResponse["variants"][number],
    quantity = 1
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, variant, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (productId: string, variantId?: string): number => {
    const itemId = generateCartItemId(productId, variantId);
    const item = state.items.find((item: ICartItem) => item.id === itemId);
    return item?.quantity || 0;
  };

  const isItemInCart = (productId: string, variantId?: string): boolean => {
    return getItemQuantity(productId, variantId) > 0;
  };

  const getCartItemPrice = (item: ICartItem): number => {
    return calculateItemPrice(item);
  };

  const setOutOfStockItems = (items: IOutOfStockItem[]) => {
    dispatch({ type: "SET_OUT_OF_STOCK_ITEMS", payload: items });
  };

  const contextValue: ICartContext = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
    getCartItemPrice,
    setOutOfStockItems,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export type { CartAction };
