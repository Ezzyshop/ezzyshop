"use client";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
 * Loads the feed of unclaimed delivery orders and keeps it live over the socket.
 * The initial load is backed by React Query (so remounting doesn't get stuck on a
 * spinner), while socket events mutate a local copy for instant updates.
 */
export const useCourierFeed = (enabled: boolean) => {
  const [orders, setOrders] = useState<ICourierOrder[]>([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["courier-feed"],
    queryFn: () => CourierService.getFeed(),
    enabled,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Seed / re-sync local orders whenever the query returns fresh data
  useEffect(() => {
    if (data?.data) setOrders(data.data);
  }, [data]);

  const removeOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  }, []);

  // Live socket subscription
  useEffect(() => {
    if (!enabled) return;

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

  // Only show the full-screen spinner on the very first load (no data yet)
  return { orders, isLoading: enabled && isLoading, isFetching, removeOrder };
};
