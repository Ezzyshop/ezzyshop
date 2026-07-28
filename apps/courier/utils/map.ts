import WebApp from "@twa-dev/sdk";

export const googleMapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

export const yandexMapsUrl = (lat: number, lng: number) =>
  `https://yandex.uz/maps/?pt=${lng},${lat}&z=17&l=map`;

/**
 * Opens a URL in the device's external browser / maps app, falling back to a
 * plain window open outside Telegram.
 */
export const openExternal = (url: string) => {
  try {
    WebApp.openLink(url);
  } catch {
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }
};
