import { MinusIcon, PlusIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";

interface IProps {
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleAddToCart: () => void;
  currentQuantity: number;
}

export const ProductAddToCardButton = ({
  currentQuantity,
  handleAddToCart,
  handleDecrement,
  handleIncrement,
}: IProps) => {
  const t = useTranslations("product");

  const handleAddToCartButton = () => {
    handleAddToCart();
  };

  return (
    <div className="bg-background rounded-xl p-1">
      {currentQuantity > 0 ? (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-12 p-4 border-none"
            onClick={handleIncrement}
          >
            <PlusIcon className="size-full" />
          </Button>
          <span className="text-md tabular-nums">{currentQuantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-12 p-4  border-none"
            onClick={handleDecrement}
          >
            <MinusIcon className="size-full" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleAddToCartButton}
          className="w-full rounded-full"
          size="xl"
        >
          {t("add_to_cart")}
        </Button>
      )}
    </div>
  );
};
