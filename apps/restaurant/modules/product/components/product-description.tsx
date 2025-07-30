import { IProductResponse } from "@repo/api/services/products/index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { Card } from "@repo/ui/components/ui/card";
import { useLocale, useTranslations } from "next-intl";

interface IProps {
  product: IProductResponse;
}

export const ProductDescription = ({ product }: IProps) => {
  const locale = useLocale();
  const t = useTranslations("product");

  if (!product.description[locale]) return null;

  return (
    <Card className="shadow-none border-0 p-3 gap-2">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-0 items-center">
            <p className="text-lg font-medium">{t("description")}</p>
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            <div
              dangerouslySetInnerHTML={{
                __html: product.description[locale],
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
