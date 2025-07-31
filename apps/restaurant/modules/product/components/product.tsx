"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ProductBasicInformation } from "./product-basic-information/product-basic-information";
import { ProductAddToCart } from "./product-add-to-cart/product-add-to-cart";
import { ProductDescription } from "./product-description";
import { SimilarProducts } from "./similar-products";
import { IProductResponse } from "@repo/api/services/products/index";
import { useState, useEffect } from "react";
import { useCart } from "@repo/contexts/cart-context/cart.context";

interface IProps {
  product: IProductResponse;
  shopId: string;
}

export const Product = ({ product, shopId }: IProps) => {
  const [selectedVariant, setSelectedVariant] =
    useState<IProductResponse["variants"][number]>();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem, getItemQuantity, updateQuantity, removeItem } = useCart();

  const currentQuantity = getItemQuantity(product._id, selectedVariant?._id);

  const getCartItemId = () => {
    return selectedVariant?._id
      ? `${product._id}-${selectedVariant._id}`
      : product._id;
  };

  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product.variants, selectedVariant]);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);

      addItem(product, selectedVariant, 1);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncrement = async () => {
    try {
      setIsAddingToCart(true);

      const availableStock = selectedVariant?.quantity ?? 0;
      if (currentQuantity >= availableStock) {
        return;
      }

      addItem(product, selectedVariant, 1);
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDecrement = async () => {
    try {
      setIsAddingToCart(true);

      const cartItemId = getCartItemId();

      if (currentQuantity <= 1) {
        removeItem(cartItemId);
      } else {
        updateQuantity(cartItemId, currentQuantity - 1);
      }
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="px-4 py-3 space-y-3">
      <PageHeader />
      <ProductBasicInformation product={product} />
      <ProductAddToCart
        product={product}
        selectedVariant={selectedVariant}
        onVariantSelect={setSelectedVariant}
        currentQuantity={currentQuantity}
        onAddToCart={handleAddToCart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        isAddingToCart={isAddingToCart}
      />
      <ProductDescription product={product} />
      <SimilarProducts product={product} shopId={shopId} />
    </div>
  );
};
