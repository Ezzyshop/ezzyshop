import { Button } from "@repo/ui/components/ui/button";
import { DialogTitle } from "@repo/ui/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { TObject } from "@repo/hooks/use-query-params";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { XIcon } from "@repo/ui/components/icons/index";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Label } from "@repo/ui/components/ui/label";

interface IProps {
  getQueryParams: () => TObject;
  setQueryParams: (params: TObject) => void;
}

export const ProductSortFilter = ({
  getQueryParams,
  setQueryParams,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("search");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    getQueryParams().sortOrder as "asc" | "desc" | undefined
  );

  const isActive = Boolean(getQueryParams().sortOrder);

  const handleSubmit = () => {
    setQueryParams({ ...getQueryParams(), sortBy: "price", sortOrder });
    setIsOpen(false);
  };

  useEffect(() => {
    setSortOrder(getQueryParams().sortOrder as "asc" | "desc" | undefined);
  }, [getQueryParams]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className="rounded-full"
          size="sm"
        >
          {t("sort")}
          {isActive && (
            <span
              aria-label="Clear price filter"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQueryParams({
                  ...getQueryParams(),
                  sortBy: undefined,
                  sortOrder: undefined,
                });
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
        <DialogTitle className="text-center">{t("first_shown")}</DialogTitle>
        <div className="p-4 pt-0 ">
          <RadioGroup
            className="gap-0"
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <div className="flex items-center gap-2 py-4 border-b">
              <Label htmlFor="cheapest" className="flex-grow">
                {t("cheapest")}
              </Label>
              <RadioGroupItem value="asc" id="cheapest" />
            </div>
            <div className="flex items-center gap-2 py-4 border-b">
              <Label htmlFor="most-expensive" className="flex-grow">
                {t("most-expensive")}
              </Label>
              <RadioGroupItem value="desc" id="most-expensive" />
            </div>
          </RadioGroup>
          <Button type="submit" className="w-full mt-4" onClick={handleSubmit}>
            {t("apply")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
