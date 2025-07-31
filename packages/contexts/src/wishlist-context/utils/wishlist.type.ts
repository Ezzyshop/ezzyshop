import { IProductResponse } from "@repo/api/services/products/index";
import { IWishlistItem } from "./wishlist.interface";

export type WishlistAction =
  | { type: "LOAD_WISHLIST"; payload: IWishlistItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_ITEM"; payload: { product: IProductResponse } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_WISHLIST" };
