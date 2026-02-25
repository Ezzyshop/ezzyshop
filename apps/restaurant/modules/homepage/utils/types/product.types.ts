import { ICategoriesResponse } from "@repo/api/services/category/category.interface";
import { IProductResponse } from "@repo/api/services/products/product.interface";

export type TMergedProductAndCategory = ICategoriesResponse & {
  products: IProductResponse[];
};
