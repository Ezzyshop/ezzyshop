"use client";
import { IProductResponse } from "@repo/api/services/products/index";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";
import { ProductBasicInformation } from "@/modules/product/components/product-basic-information/product-basic-information";
import { ProductAddToCart } from "@/modules/product/components/product-add-to-cart/product-add-to-cart";
import { useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { X } from "@repo/ui/components/icons/index";
import { useProductCart } from "@repo/hooks/index";

interface IProps {
  product: IProductResponse;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductVariantDrawer = ({ product, isOpen, onClose }: IProps) => {
  const {
    selectedVariant,
    setSelectedVariant,
    currentQuantity,
    isLoading,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    initializeDefaultVariant,
  } = useProductCart(product);

  useEffect(() => {
    if (isOpen) {
      initializeDefaultVariant();
    }
  }, [isOpen, initializeDefaultVariant]);

  const handleAddToCartAndClose = async () => {
    await handleAddToCart();
    onClose();
  };

  const handleIncrementAndClose = async () => {
    await handleIncrement();
  };

  const handleDecrementAndClose = async () => {
    await handleDecrement();
    if (currentQuantity <= 1) {
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between pb-2">
          <DrawerTitle className="text-left">Select Options</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4 overflow-y-auto">
          <div className="space-y-4">
            <ProductBasicInformation product={product} />
            <ProductAddToCart
              product={product}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
              currentQuantity={currentQuantity}
              onAddToCart={handleAddToCartAndClose}
              onIncrement={handleIncrementAndClose}
              onDecrement={handleDecrementAndClose}
              isAddingToCart={isLoading}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
