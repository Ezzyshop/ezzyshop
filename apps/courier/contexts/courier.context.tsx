"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CourierService,
  ICourierProfile,
} from "@repo/api/services/courier/index";

interface ICourierContext {
  profile: ICourierProfile | null;
  isLoading: boolean;
  isFetching: boolean;
  isCourier: boolean;
  refetch: () => void;
}

const CourierContext = createContext<ICourierContext>({
  profile: null,
  isLoading: true,
  isFetching: false,
  isCourier: false,
  refetch: () => {},
});

export const useCourierContext = () => useContext(CourierContext);

export const CourierProvider = ({ children }: PropsWithChildren) => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["courier-me"],
    queryFn: () => CourierService.getMe(),
  });

  const profile = data?.data ?? null;
  const isCourier = Boolean(profile && profile.shops.length > 0);

  return (
    <CourierContext.Provider
      value={{ profile, isLoading, isFetching, isCourier, refetch: () => void refetch() }}
    >
      {children}
    </CourierContext.Provider>
  );
};
