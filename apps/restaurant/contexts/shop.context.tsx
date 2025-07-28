"use client";
import { ICommonParams } from "@/utils/interfaces";
import { IShopResponse } from "@repo/api/services/shop/shop.interface";
import { ShopService } from "@repo/api/services/shop/shop.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, PropsWithChildren, useContext } from "react";

export const ShopContext = createContext<IShopResponse>({} as IShopResponse);

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};

export const ShopProvider = ({ children }: PropsWithChildren) => {
  const { shopId } = useParams<ICommonParams>();

  const { data } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => ShopService.getShop(shopId),
    enabled: !!shopId,
  });

  if (!data) {
    return null;
  }

  return (
    <ShopContext.Provider value={data.data}>{children}</ShopContext.Provider>
  );
};
