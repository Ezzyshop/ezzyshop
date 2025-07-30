import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { ProductImages } from "./product-images";
import { useLocale } from "next-intl";

interface IProps {
  product: IProductResponse;
}

export const ProductBasicInformation = ({ product }: IProps) => {
  const locale = useLocale();
  return (
    <Card className="shadow-none border-0 p-3 gap-2">
      <ProductImages images={product.images} />

      <p className="text-xl text-gray-500 mt-20">{product.name[locale]}</p>
    </Card>
  );
};
