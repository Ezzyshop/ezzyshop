"use client";
import { useEffect, useState } from "react";

/**
 * Returns remaining seconds until `deadlineISO`.
 * Counts below zero (does not stop at 0) — negative means the courier is late.
 * Returns null if no deadline is provided.
 */
export const useCountdown = (deadlineISO: string | undefined): number | null => {
  const getRemaining = () => {
    if (!deadlineISO) return null;
    return Math.floor((new Date(deadlineISO).getTime() - Date.now()) / 1000);
  };

  const [remaining, setRemaining] = useState<number | null>(getRemaining);

  useEffect(() => {
    if (!deadlineISO) return;
    const interval = setInterval(() => {
      setRemaining(Math.floor((new Date(deadlineISO).getTime() - Date.now()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineISO]);

  return remaining;
};

export const formatCountdown = (seconds: number): string => {
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60)
    .toString()
    .padStart(2, "0");
  const s = (abs % 60).toString().padStart(2, "0");
  return seconds < 0 ? `-${m}:${s}` : `${m}:${s}`;
};
