import { IOrderPaymentInfo } from "@repo/api/services/order/order.interface";

const isMobile = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const APP_OPEN_FALLBACK_MS = 1500;

/**
 * Redirect to provider checkout. On mobile, attempt the app deeplink first
 * and fall back to the web URL if the app is not installed.
 */
export const redirectToPaymentProvider = (payment: IOrderPaymentInfo): void => {
  if (typeof window === "undefined") return;

  const { web_url, app_url } = payment;

  if (!isMobile() || !app_url || app_url === web_url) {
    window.location.href = web_url;
    return;
  }

  const fallbackTimer = window.setTimeout(() => {
    window.location.href = web_url;
  }, APP_OPEN_FALLBACK_MS);

  const cancelFallback = () => {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  const onVisibilityChange = () => {
    if (document.hidden) cancelFallback();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.location.href = app_url;
};
