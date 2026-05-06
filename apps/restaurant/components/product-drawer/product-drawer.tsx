import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { DialogTitle } from "@repo/ui/components/ui/dialog";
import { Drawer, DrawerContent } from "@repo/ui/components/ui/drawer";
import { AdaptiveImage } from "@repo/shared-modules/components/adaptive-image/adaptive-image";
import { useLocale } from "next-intl";
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
        className="max-h-[90vh] h-[90vh] flex flex-col bg-muted"
      >
        <DialogTitle className="hidden" />
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          <AdaptiveImage
            src={product.main_image}
            alt={product.name[language]}
            maxHeight={200}
            containerClassName="rounded-xl bg-background"
            imageClassName="rounded-xl"
            fetchPriority="high"
            loading="lazy"
          />
          <div className="p-4 bg-background rounded-xl">
            <h2 className="text-xl font-bold">{product.name[language]}</h2>
            <div className="flex items-center gap-2 mt-2">
              <p
                className={
                  selectedVariant?.compare_at_price != null &&
                  selectedVariant.compare_at_price > selectedVariant.price
                    ? "text-lg font-semibold text-red-500"
                    : "text-lg"
                }
              >
                {selectedVariant?.price.toLocaleString()} {currency.symbol}
              </p>
              {selectedVariant?.compare_at_price != null &&
                selectedVariant.compare_at_price > selectedVariant.price && (
                  <p className="text-sm text-muted-foreground line-through">
                    {selectedVariant.compare_at_price.toLocaleString()}{" "}
                    {currency.symbol}
                  </p>
                )}
            </div>
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};
