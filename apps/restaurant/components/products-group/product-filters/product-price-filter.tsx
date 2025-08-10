import { Button } from "@repo/ui/components/ui/button";
import { DialogTitle } from "@repo/ui/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { TObject } from "@repo/hooks/use-query-params";
import { Input } from "@repo/ui/components/ui/input";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useShopContext } from "@/contexts/shop.context";
import { XIcon } from "@repo/ui/components/icons/index";

interface IProps {
  getQueryParams: () => TObject;
  setQueryParams: (params: TObject) => void;
}

export const ProductPriceFilter = ({
  getQueryParams,
  setQueryParams,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("search");
  const [prices, setPrices] = useState<{ gte: number; lte: number }>(() => {
    const price = getQueryParams().price as
      | { gte: number; lte: number }
      | undefined;

    return price ?? { gte: 0, lte: 0 };
  });
  const { currency } = useShopContext();

  const isActive = Boolean(getQueryParams().price);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (prices.gte == 0 && prices.lte == 0) {
      setQueryParams({ ...getQueryParams(), price: undefined });
    } else {
      setQueryParams({
        "price[gte]": Number(prices.gte),
        "price[lte]": Number(prices.lte),
      });
    }
    setIsOpen(false);
  };

  const handleBlurGte = (e: React.FocusEvent<HTMLInputElement>) => {
    setPrices((prev) => ({ ...prev, gte: Number(e.target.value) }));

    if (Number(e.target.value) > Number(prices.lte)) {
      setPrices((prev) => ({ ...prev, lte: Number(e.target.value) }));
    }
  };

  const handleBlurLte = (e: React.FocusEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < Number(prices.gte)) {
      setPrices((prev) => ({ ...prev, lte: Number(prices.gte) }));
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          {t("price")}
          {isActive && (
            <span
              aria-label="Clear price filter"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQueryParams({ ...getQueryParams(), price: undefined });
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="ml-1 inline-flex items-center justify-center"
            >
              <XIcon className="size-4" />
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-4">
        <DialogTitle className="text-center">
          {t("price")}, {currency.symbol}
        </DialogTitle>
        <div className="grid grid-cols-2 gap-3 p-4 pt-0">
          <Input
            type="number"
            className="w-full"
            id="price"
            value={prices.gte}
            name="gte"
            onChange={handleChange}
            onBlur={handleBlurGte}
            suffix={t("from")}
          />
          <Input
            type="number"
            className="w-full"
            id="price"
            value={prices.lte}
            name="lte"
            min={prices.gte}
            onChange={handleChange}
            onBlur={handleBlurLte}
            suffix={t("to")}
          />
          <Button type="submit" className="col-span-2" onClick={handleSubmit}>
            {t("apply")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
