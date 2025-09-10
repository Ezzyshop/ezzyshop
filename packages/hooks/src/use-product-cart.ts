import { useState } from "react";
import { IProductResponse } from "@repo/api/services/products/index";
import { useCart } from "@repo/contexts/cart-context/cart.context";
import { useSearchParams } from "next/navigation";

export const useProductCart = (product: IProductResponse) => {
  const [selectedVariant, setSelectedVariant] =
    useState<IProductResponse["variants"][number]>();
  const [isLoading, setIsLoading] = useState(false);
  const variantId = useSearchParams()?.get("variant");

  const { addItem, getItemQuantity, updateQuantity, removeItem } = useCart();

  // Get current quantity in cart for the selected variant
  const currentQuantity = getItemQuantity(product._id, selectedVariant?._id);

  // Generate cart item ID for the selected variant
  const getCartItemId = () => {
    return selectedVariant?._id
      ? `${product._id}-${selectedVariant._id}`
      : product._id;
  };

  // Initialize default variant (first available variant)
  const initializeDefaultVariant = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      const variant = product.variants.find(
        (variant) => variant._id === variantId
      );

      setSelectedVariant(variant ?? product.variants[0]);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      addItem(product, selectedVariant, 1);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    try {
      setIsLoading(true);

      const availableStock = selectedVariant?.quantity ?? 0;
      if (currentQuantity >= availableStock) {
        return;
      }

      addItem(product, selectedVariant, 1);
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    try {
      setIsLoading(true);

      const cartItemId = getCartItemId();

      if (currentQuantity <= 1) {
        removeItem(cartItemId);
      } else {
        updateQuantity(cartItemId, currentQuantity - 1);
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedVariant,
    setSelectedVariant,
    currentQuantity,
    isLoading,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    initializeDefaultVariant,
  };
};
