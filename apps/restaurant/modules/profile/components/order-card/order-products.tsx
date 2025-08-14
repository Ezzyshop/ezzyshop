import { ProductCardOrder } from "@/components/product-card-order/product-card-order";
import { IOrderProduct } from "@repo/api/services/order/order.interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { useTranslations } from "next-intl";

interface IProps {
  products: IOrderProduct[];
}

export const OrderProducts = ({ products }: IProps) => {
  const t = useTranslations("orders");
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="py-1">{t("products")}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance mt-2">
          {products.map((product) => (
            <ProductCardOrder key={product._id} product={product} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
