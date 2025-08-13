import { IProductResponse } from "@repo/api/services/products/index";
import { ICartItem, IOutOfStockItem } from "./cart.interface";

export type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        product: IProductResponse;
        variant?: IProductResponse["variants"][number];
        quantity?: number;
      };
    }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: ICartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_OUT_OF_STOCK_ITEMS";
      payload: IOutOfStockItem[];
    };
