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
  WishlistAction,
  IWishlistItem,
  IWishlistState,
  calculateWishlistTotals,
  generateWishlistItemId,
} from "./utils";

const initialState: IWishlistState = {
  items: [],
  isLoading: true,
  totalItems: 0,
};

const WISHLIST_STORAGE_KEY = (shopId: string) => `${shopId}-wishlist`;

const wishlistReducer = (
  state: IWishlistState,
  action: WishlistAction
): IWishlistState => {
  switch (action.type) {
    case "LOAD_WISHLIST": {
      const { totalItems } = calculateWishlistTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
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
      const { product } = action.payload;
      const itemId = generateWishlistItemId(product._id);

      // Check if item already exists in wishlist
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      // If item already exists, don't add it again
      if (existingItemIndex >= 0) {
        return state;
      }

      // Add new item
      const newItem: IWishlistItem = {
        id: itemId,
        product,
        addedAt: Date.now(),
      };

      const newItems = [...state.items, newItem];
      const { totalItems } = calculateWishlistTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      const { totalItems } = calculateWishlistTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
      };
    }

    case "CLEAR_WISHLIST": {
      return {
        ...state,
        items: [],
        totalItems: 0,
      };
    }

    default:
      return state;
  }
};

export interface IWishlistContext extends IWishlistState {
  addItem: (product: IProductResponse) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isItemInWishlist: (productId: string) => boolean;
  toggleItem: (product: IProductResponse) => void;
}

const WishlistContext = createContext<IWishlistContext | undefined>(undefined);

export const useWishlist = (): IWishlistContext => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const shopId = "mock-shop-id"; // This should be dynamic based on actual shop

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlistFromStorage = () => {
      try {
        const savedWishlist = localStorage.getItem(
          WISHLIST_STORAGE_KEY(shopId)
        );
        if (savedWishlist) {
          const parsedWishlist: IWishlistItem[] = JSON.parse(savedWishlist);
          dispatch({ type: "LOAD_WISHLIST", payload: parsedWishlist });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadWishlistFromStorage();
  }, [shopId]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(
          WISHLIST_STORAGE_KEY(shopId),
          JSON.stringify(state.items)
        );
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
    }
  }, [state.items, state.isLoading, shopId]);

  // Action handlers
  const addItem = (product: IProductResponse) => {
    dispatch({ type: "ADD_ITEM", payload: { product } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: productId } });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isItemInWishlist = (productId: string): boolean => {
    return state.items.some((item) => item.id === productId);
  };

  const toggleItem = (product: IProductResponse) => {
    if (isItemInWishlist(product._id)) {
      removeItem(product._id);
    } else {
      addItem(product);
    }
  };

  const contextValue: IWishlistContext = {
    ...state,
    addItem,
    removeItem,
    clearWishlist,
    isItemInWishlist,
    toggleItem,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export type { WishlistAction };
