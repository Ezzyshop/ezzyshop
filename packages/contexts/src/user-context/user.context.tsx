"use client";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { IUserResponse, UserService } from "@repo/api/services/user/index";
import { useQuery } from "@tanstack/react-query";

export const UserContext = createContext<IUserContext | null>(null);

interface IUserContext {
  user: IUserResponse | null;
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => UserService.getCurrentUser(),
  });

  const values = useMemo(
    () => ({
      user: user?.data ?? null,
    }),
    [user]
  );

  if (isLoading) return null;

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
