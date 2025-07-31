import { IProductResponse } from "@repo/api/services/products/index";
import { IViewedProductItem } from "./viewed-products.interface";

export type ViewedProductsAction =
  | { type: "LOAD_VIEWED_PRODUCTS"; payload: IViewedProductItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_VIEWED_PRODUCT"; payload: { product: IProductResponse } }
  | { type: "CLEAR_VIEWED_PRODUCTS" };
