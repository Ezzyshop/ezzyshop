import { Truck } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";

interface IProps {
  deliveryTime: number;
}

export const ProductDeliveryTime = ({ deliveryTime }: IProps) => {
  const t = useTranslations();

  return (
    <Card className="shadow-none flex items-center flex-row gap-2 border-0 p-3">
      <Button
        variant="outline"
        className="shadow-none bg-transparent"
        size="icon"
      >
        <Truck />
      </Button>
      <p className="text-gray-500">
        {t("product.delivery_time", { day: deliveryTime })}
      </p>
    </Card>
  );
};
