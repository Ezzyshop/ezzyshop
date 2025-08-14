"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useQueryParams } from "@repo/hooks/use-query-params";
import { YandexMap } from "@repo/ui/components/ui/yandex-map";
import { useTranslations } from "next-intl";

export const MapPage = () => {
  const t = useTranslations("map");
  const { getQueryParams } = useQueryParams();
  const { lat, lng } = getQueryParams();

  const initialCoordinates: [number, number] = [
    Number(lat ?? 41.311081),
    Number(lng ?? 69.240073),
  ];

  return (
    <div>
      <PageHeader title={t("title")} />
      <YandexMap
        initialCoordinates={initialCoordinates}
        onLocationSelect={() => {}}
        height="calc(100vh - 60px)"
      />
    </div>
  );
};
