import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { DialogTitle } from "@repo/ui/components/ui/dialog";
import { Drawer, DrawerContent } from "@repo/ui/components/ui/drawer";
import { useLocale } from "next-intl";
import Image from "next/image";
import { ProductAddToCardButton } from "./product-add-to-card-button";
import { useProductCart } from "@repo/hooks/use-product-cart";
import { useEffect } from "react";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { ProductVariants } from "./product-variants";

interface IProps {
  product: IProductResponse;
  setSelectedProduct: (product: IProductResponse | null) => void;
}

export const ProductDrawer = ({ product, setSelectedProduct }: IProps) => {
  const language = useLocale() as keyof ILocale;
  const { currency } = useShopContext();
  const {
    selectedVariant,
    currentQuantity,
    handleIncrement,
    handleDecrement,
    handleAddToCart,
    initializeDefaultVariant,
    setSelectedVariant,
  } = useProductCart(product);

  useEffect(() => {
    initializeDefaultVariant();
  }, [initializeDefaultVariant]);

  return (
    <Drawer open={!!product} onOpenChange={() => setSelectedProduct(null)}>
      <DrawerContent className="!max-h-[90vh] h-[90vh]  bg-muted space-y-4  ">
        <DialogTitle className="hidden" />
        <Image
          src={product.main_image}
          alt={product.name[language]}
          width={100}
          height={100}
          className="object-cover w-full rounded-xl bg-muted"
          fetchPriority="high"
          loading="lazy"
        />
        <div className="p-4 bg-background rounded-xl">
          <h2 className="text-2xl font-bold">{product.name[language]}</h2>
          <p>
            {selectedVariant?.price.toLocaleString()} {currency.symbol}
          </p>
          <p
            dangerouslySetInnerHTML={{ __html: product.description[language] }}
          />
        </div>

        <ProductVariants
          variants={product.variants || []}
          setSelectedVariant={setSelectedVariant}
          selectedVariant={selectedVariant}
        />

        <ProductAddToCardButton
          currentQuantity={currentQuantity}
          handleAddToCart={handleAddToCart}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
        />
      </DrawerContent>
    </Drawer>
  );
};
