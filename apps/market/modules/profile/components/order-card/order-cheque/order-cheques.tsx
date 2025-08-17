import { IOrderResponse } from "@repo/api/services/order/order.interface";
import { TransactionChequeImageStatus } from "@repo/api/services/transaction/transaction.enum";
import { Separator } from "@repo/ui/components/ui/separator";
import { OrderChequeUploadButton } from "./order-cheque-upload-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { OrderChequeDetailButton } from "./order-cheque-detail-button";
import { useTranslations } from "next-intl";

interface IProps {
  transaction: IOrderResponse["transaction"];
}

export const OrderCheques = ({ transaction }: IProps) => {
  const t = useTranslations("orders");
  return (
    <>
      {transaction.cheque_images.every(
        (c) => c.status === TransactionChequeImageStatus.Rejected
      ) && <OrderChequeUploadButton transactionId={transaction._id} />}

      {transaction.cheque_images.length > 0 && (
        <>
          <Separator className="my-2" />

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-1">
                {t("cheques")}
              </AccordionTrigger>
              {transaction.cheque_images.map((cheque, index) => (
                <AccordionContent
                  key={`${transaction._id}-${index}`}
                  className="first:mt-2 p-0"
                >
                  <OrderChequeDetailButton cheque={cheque} />
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </>
      )}
    </>
  );
};
