import { IOrderResponse } from "@repo/api/services/order/order.interface";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { TransactionChequeImageStatus } from "@repo/api/services/transaction/transaction.enum";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import Image from "next/image";

interface IProps {
  cheque: IOrderResponse["transaction"]["cheque_images"][number];
}

export const OrderChequeDetailButton = ({ cheque }: IProps) => {
  const t = useTranslations("orders");

  const getButton = () => {
    if (cheque.status === TransactionChequeImageStatus.Pending) {
      return (
        <Button variant="outline" className="w-full shadow-none">
          {t("cheque_upload_pending")}
        </Button>
      );
    }
    if (cheque.status === TransactionChequeImageStatus.Verified) {
      return (
        <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">
          {t("cheque_upload_verified")}
        </Button>
      );
    }
    if (cheque.status === TransactionChequeImageStatus.Rejected) {
      return (
        <Button variant="destructive" className="w-full">
          {t("cheque_upload_rejected")}
        </Button>
      );
    }

    return null;
  };

  const getDrawerTitle = {
    [TransactionChequeImageStatus.Pending]: t("cheque_upload_pending"),
    [TransactionChequeImageStatus.Verified]: t("cheque_upload_verified"),
    [TransactionChequeImageStatus.Rejected]: t("cheque_upload_rejected"),
  };

  const getDrawerDescription = {
    [TransactionChequeImageStatus.Pending]: t(
      "cheque_upload_pending_description"
    ),
    [TransactionChequeImageStatus.Verified]: t(
      "cheque_upload_verified_description"
    ),
    [TransactionChequeImageStatus.Rejected]: t(
      "cheque_upload_rejected_description"
    ),
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{getButton()}</DrawerTrigger>
      <DrawerContent className="p-4 pt-0 space-y-4">
        <div>
          <DrawerTitle>{getDrawerTitle[cheque.status]}</DrawerTitle>
          <DrawerDescription>
            {getDrawerDescription[cheque.status]}
          </DrawerDescription>
        </div>
        <div className="flex items-center justify-center relative h-[400px] w-full">
          <Image
            src={cheque.url}
            fill
            alt="cheque"
            className="w-full h-full object-contain"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
