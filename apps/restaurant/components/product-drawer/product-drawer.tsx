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
      <DrawerContent
        data-vaul-custom-container="true"
        withTrigger={false}
        className="max-h-[90vh]! h-[90vh] overflow-y-auto bg-muted space-y-4"
      >
        <DialogTitle className="hidden" />
        <div className="relative w-full max-h-[60vh] aspect-9/16 rounded-xl bg-background">
          <Image
            src={product.main_image}
            alt={product.name[language]}
            fill
            className="object-contain w-full rounded-xl"
            fetchPriority="high"
            loading="lazy"
            sizes="100vw"
          />
        </div>
        <div className="p-4 bg-background rounded-xl">
          <h2 className="text-xl font-bold">{product.name[language]}</h2>
          <p className="text-lg mt-2">
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
