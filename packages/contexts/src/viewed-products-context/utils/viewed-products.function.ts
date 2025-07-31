import {
  IViewedProductItem,
  VIEWED_PRODUCTS_LIMIT,
} from "./viewed-products.interface";

const generateViewedProductItemId = (productId: string): string => {
  return productId;
};

const calculateViewedProductsTotals = (items: IViewedProductItem[]) => {
  const totalItems = items.length;
  return { totalItems };
};

// Add or move product to front of the list (most recent first)
const addOrMoveToFront = (
  items: IViewedProductItem[],
  newItem: IViewedProductItem
): IViewedProductItem[] => {
  // Remove the item if it already exists
  const filteredItems = items.filter((item) => item.id !== newItem.id);

  // Add the new/updated item to the front
  const updatedItems = [newItem, ...filteredItems];

  // Limit the number of items to prevent localStorage bloat
  return updatedItems.slice(0, VIEWED_PRODUCTS_LIMIT);
};

export {
  generateViewedProductItemId,
  calculateViewedProductsTotals,
  addOrMoveToFront,
};
