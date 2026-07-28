"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@repo/ui/components/ui/drawer";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { googleMapsUrl, yandexMapsUrl, openExternal } from "@/utils/map";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lat: number;
  lng: number;
}

export const MapDrawer = ({ open, onOpenChange, lat, lng }: IProps) => {
  const t = useTranslations("courier");

  const openWith = (url: string) => {
    openExternal(url);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            {t("map.title")}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            size="xl"
            onClick={() => openWith(googleMapsUrl(lat, lng))}
          >
            {t("map.google")}
          </Button>
          <Button
            size="xl"
            variant="outline"
            onClick={() => openWith(yandexMapsUrl(lat, lng))}
          >
            {t("map.yandex")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
