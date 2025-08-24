"use client";

import { useTMAInit } from "@/hooks";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  useTMAInit();

  return children;
}
