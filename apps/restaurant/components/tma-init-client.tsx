"use client";
import { useTMAInit } from "@repo/hooks/use-tma-init";

function TMAInitClient() {
  useTMAInit();
  return null;
}

export default TMAInitClient;
