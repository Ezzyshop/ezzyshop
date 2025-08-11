import { useUserContext } from "@repo/contexts/user-context/user.context";
import { LinkProps } from "next/link";
import { LoginDrawer } from "./auth-drawers/login-drawer";
import { PropsWithChildren } from "react";
import { CustomLink } from "./custom-link";

export const ProtectedLink = ({
  children,
  ...props
}: LinkProps & PropsWithChildren) => {
  const { user } = useUserContext();

  if (!user) {
    return <LoginDrawer>{children}</LoginDrawer>;
  }

  return <CustomLink {...props}>{children}</CustomLink>;
};
