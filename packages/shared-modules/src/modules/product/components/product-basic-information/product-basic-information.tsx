import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { ProductImages } from "./product-images";
import { useLocale } from "next-intl";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  product: IProductResponse;
}

export const ProductBasicInformation = ({ product }: IProps) => {
  const locale = useLocale() as keyof ILocale;
  const allImages = product.variants.flatMap((variant) => variant.images);

  return (
    <Card className="shadow-none border-0 p-3 gap-2">
      <ProductImages
        images={allImages.length > 0 ? allImages : [product.main_image]}
        video={product.video}
      />

      <p className={cn("text-xl text-gray-500", allImages.length > 1 ? "mt-20" : "mt-4")}>{product.name[locale]}</p>
    </Card>
  );
};
