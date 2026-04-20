"use client";

import { PropsWithChildren } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export type Steps = "check-user" | "create-user" | "login" | "verify-otp";

export const LoginDrawer = ({
  children,
  className,
  asChild: _asChild,
  onSuccess: _onSuccess,
}: PropsWithChildren & {
  className?: string;
  asChild?: boolean;
  onSuccess?: () => void;
}) => {
  const router = useRouter();
  const params = useParams<{ locale: string; shopId: string }>();

  const handleClick = () => {
    router.push(`/${params.locale}/${params.shopId}/login`);
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};
