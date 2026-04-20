"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import { CheckUser } from "./auth/check-user";
import { CreateUser } from "./auth/create-user";
import { LoginUser } from "./auth/login-user";
import { VerifyOtp } from "./auth/verify-otp";
import type { Steps } from "./login-drawer";

export const LoginPageContent = () => {
  const { name, logo } = useShopContext();
  const t = useTranslations("profile");
  const router = useRouter();

  const [steps, setSteps] = useState<Steps>("verify-otp");
  const [phone, setPhone] = useState<string | undefined>(undefined);

  const handleClose = () => {
    router.back();
  };

  const currentStep = useMemo(() => {
    switch (steps) {
      case "verify-otp":
        return <VerifyOtp setIsOpen={(open) => { if (!open) handleClose(); }} />;
      case "check-user":
        return <CheckUser setSteps={setSteps} setPhone={setPhone} />;
      case "create-user":
        return (
          <CreateUser
            setSteps={setSteps}
            phone={phone!}
            setIsOpen={(open) => { if (!open) handleClose(); }}
          />
        );
      case "login":
        return (
          <LoginUser
            phone={phone!}
            setSteps={setSteps}
            setIsOpen={(open) => { if (!open) handleClose(); }}
          />
        );
    }
  }, [steps, phone]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 pt-16 pb-8">
      <Avatar className="size-16">
        <AvatarImage src={logo ?? undefined} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold mt-3 mb-1 text-center">
        {t("login_to_shop", { name })}
      </h1>
      <div className="w-full mt-4">{currentStep}</div>
    </div>
  );
};
