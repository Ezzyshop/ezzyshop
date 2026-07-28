"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CourierService,
  ICourierOrder,
  ICourierOrderClaimed,
  COURIER_ORDER_NEW,
  COURIER_ORDER_CLAIMED,
} from "@repo/api/services/courier/index";
import { getSupportSocket, reconnectSupportSocket } from "@repo/api/socket";
import { startAlarm, stopAlarm } from "@/utils/audio";

/**
 * Loads the initial feed of unclaimed delivery orders and keeps it live over the
 * socket. Plays the looping alarm whenever there is at least one pending order.
 * `enabled` gates the whole thing on the courier being authenticated.
 */
export const useCourierFeed = (enabled: boolean) => {
  const [orders, setOrders] = useState<ICourierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const seededRef = useRef(false);

  const removeOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  }, []);

  // Initial feed load
  useEffect(() => {
    if (!enabled || seededRef.current) return;
    seededRef.current = true;
    let cancelled = false;
    CourierService.getFeed()
      .then((res) => {
        if (!cancelled) setOrders(res.data ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Live socket subscription
  useEffect(() => {
    if (!enabled) return;

    // Ensure the socket carries the freshly stored auth token
    reconnectSupportSocket();
    const socket = getSupportSocket();

    const onNew = (order: ICourierOrder) => {
      setOrders((prev) =>
        prev.some((o) => o.orderId === order.orderId) ? prev : [order, ...prev]
      );
    };

    const onClaimed = (payload: ICourierOrderClaimed) => {
      removeOrder(payload.orderId);
    };

    socket.on(COURIER_ORDER_NEW, onNew);
    socket.on(COURIER_ORDER_CLAIMED, onClaimed);

    return () => {
      socket.off(COURIER_ORDER_NEW, onNew);
      socket.off(COURIER_ORDER_CLAIMED, onClaimed);
    };
  }, [enabled, removeOrder]);

  // Alarm follows the pending-order count
  useEffect(() => {
    if (enabled && orders.length > 0) {
      startAlarm();
    } else {
      stopAlarm();
    }
    return () => stopAlarm();
  }, [enabled, orders.length]);

  return { orders, isLoading, removeOrder };
};
