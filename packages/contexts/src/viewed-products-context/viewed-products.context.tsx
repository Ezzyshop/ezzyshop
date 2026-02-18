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
  ViewedProductsAction,
  IViewedProductItem,
  IViewedProductsState,
  calculateViewedProductsTotals,
  generateViewedProductItemId,
  addOrMoveToFront,
} from "./utils";

const initialState: IViewedProductsState = {
  items: [],
  isLoading: true,
  totalItems: 0,
};

const VIEWED_PRODUCTS_STORAGE_KEY = (shopId: string) =>
  `${shopId}-viewed-products`;

const viewedProductsReducer = (
  state: IViewedProductsState,
  action: ViewedProductsAction
): IViewedProductsState => {
  switch (action.type) {
    case "LOAD_VIEWED_PRODUCTS": {
      const { totalItems } = calculateViewedProductsTotals(action.payload);
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

    case "ADD_VIEWED_PRODUCT": {
      const { product } = action.payload;
      const itemId = generateViewedProductItemId(product._id);

      // Create new viewed product item
      const newItem: IViewedProductItem = {
        id: itemId,
        product,
        viewedAt: Date.now(),
      };

      // Add or move to front (most recent first)
      const newItems = addOrMoveToFront(state.items, newItem);
      const { totalItems } = calculateViewedProductsTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
      };
    }

    case "CLEAR_VIEWED_PRODUCTS": {
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

export interface IViewedProductsContext extends IViewedProductsState {
  addViewedProduct: (product: IProductResponse) => void;
  clearViewedProducts: () => void;
  getRecentlyViewed: (limit?: number) => IViewedProductItem[];
  isProductRecentlyViewed: (productId: string) => boolean;
}

const ViewedProductsContext = createContext<IViewedProductsContext | undefined>(
  undefined
);

export const useViewedProducts = (): IViewedProductsContext => {
  const context = useContext(ViewedProductsContext);
  if (!context) {
    throw new Error(
      "useViewedProducts must be used within a ViewedProductsProvider"
    );
  }
  return context;
};

export const ViewedProductsProvider: React.FC<PropsWithChildren & { shopId: string }> = ({
  children,
  shopId,
}) => {
  const [state, dispatch] = useReducer(viewedProductsReducer, initialState);

  // Load viewed products from localStorage on mount
  useEffect(() => {
    const loadViewedProductsFromStorage = () => {
      try {
        const savedViewedProducts = localStorage.getItem(
          VIEWED_PRODUCTS_STORAGE_KEY(shopId)
        );
        if (savedViewedProducts) {
          const parsedViewedProducts: IViewedProductItem[] =
            JSON.parse(savedViewedProducts);
          dispatch({
            type: "LOAD_VIEWED_PRODUCTS",
            payload: parsedViewedProducts,
          });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error(
          "Error loading viewed products from localStorage:",
          error
        );
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadViewedProductsFromStorage();
  }, [shopId]);

  // Save viewed products to localStorage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(
          VIEWED_PRODUCTS_STORAGE_KEY(shopId),
          JSON.stringify(state.items)
        );
      } catch (error) {
        console.error("Error saving viewed products to localStorage:", error);
      }
    }
  }, [state.items, state.isLoading, shopId]);

  // Action handlers
  const addViewedProduct = (product: IProductResponse) => {
    dispatch({ type: "ADD_VIEWED_PRODUCT", payload: { product } });
  };

  const clearViewedProducts = () => {
    dispatch({ type: "CLEAR_VIEWED_PRODUCTS" });
  };

  const getRecentlyViewed = (limit?: number): IViewedProductItem[] => {
    return limit ? state.items.slice(0, limit) : state.items;
  };

  const isProductRecentlyViewed = (productId: string): boolean => {
    return state.items.some((item) => item.id === productId);
  };

  const contextValue: IViewedProductsContext = {
    ...state,
    addViewedProduct,
    clearViewedProducts,
    getRecentlyViewed,
    isProductRecentlyViewed,
  };

  return (
    <ViewedProductsContext.Provider value={contextValue}>
      {children}
    </ViewedProductsContext.Provider>
  );
};

export type { ViewedProductsAction };
