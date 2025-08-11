import { useUserContext } from "@repo/contexts/user-context/user.context";
import { LinkProps } from "next/link";
import { LoginDrawer } from "./auth-drawers/login-drawer";
import { PropsWithChildren } from "react";
import { CustomLink } from "./custom-link";
import { useRouter } from "nextjs-toploader/app";
import { useParams } from "next/navigation";
import { ICommonParams } from "@/utils/interfaces";

export const ProtectedLink = ({
  children,
  asChild,
  ...props
}: LinkProps & PropsWithChildren & { asChild?: boolean }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const { locale, shopId } = useParams<ICommonParams>();

  if (!user) {
    return (
      <LoginDrawer
        asChild={asChild}
        onSuccess={() => router.push(`/${locale}/${shopId}${props.href}`)}
      >
        {children}
      </LoginDrawer>
    );
  }

  return <CustomLink {...props}>{children}</CustomLink>;
};
