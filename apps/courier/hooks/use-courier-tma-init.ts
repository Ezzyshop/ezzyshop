"use client";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

/**
 * Initializes the Telegram Web App for the courier panel.
 * Requests true fullscreen (Bot API 8.0+) and disables gestures that would
 * accidentally close/collapse the app while a courier is working.
 */
export const useCourierTMAInit = () => {
  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      // Fullscreen webview (requested explicitly for couriers)
      const wa = WebApp as unknown as { requestFullscreen?: () => void };
      wa.requestFullscreen?.();
      WebApp.enableClosingConfirmation();
      WebApp.disableVerticalSwipes();
      WebApp.setHeaderColor("#000000");
    } catch {
      // Older Telegram clients may not support every call — ignore gracefully.
    }
  }, []);
};
