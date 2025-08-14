import { YMaps } from "@pbe/react-yandex-maps";

interface IProps {
  children: React.ReactNode;
}

export const YandexMapProvider = ({ children }: IProps) => {
  return (
    <YMaps
      query={{
        apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21",
        lang: "ru_RU",
        load: "Map,Placemark,map.addon.balloon",
      }}
    >
      {children}
    </YMaps>
  );
};
