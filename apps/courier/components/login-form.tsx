"use client";
import { useEffect, useState } from "react";
import { useI18nRouter } from "@repo/i18n/hooks";
import { useTranslations } from "next-intl";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/ui/input-otp";
import { UserService } from "@repo/api/services/user/user.service";
import { reconnectSupportSocket } from "@repo/api/socket";
import { toast } from "sonner";
import { useCourierContext } from "@/contexts/courier.context";
import { unlockAudio } from "@/utils/audio";

export const LoginForm = () => {
  const t = useTranslations("courier");
  const router = useI18nRouter();
  const { isCourier, refetch } = useCourierContext();
  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Already a courier → go straight to the feed
  useEffect(() => {
    if (isCourier) router.replace("/");
  }, [isCourier, router]);

  const handleVerify = async (code: string) => {
    setIsPending(true);
    // Unlock audio within this user gesture so the alarm can play later
    unlockAudio();
    try {
      const res = (await UserService.verifyOtp({ otp: code })) as {
        data?: { token?: string };
      };
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("st", token);
        reconnectSupportSocket();
      }
      await refetch();
      router.replace("/");
    } catch {
      setOtp("");
      toast.error(t("login.invalid_otp"));
    } finally {
      setIsPending(false);
    }
  };

  const onChange = (value: string) => {
    setOtp(value);
    if (value.length === 6 && !isPending) {
      handleVerify(value);
    }
  };

  const botUsername =
    process.env.NEXT_PUBLIC_COURIER_TELEGRAM_BOT ||
    process.env.NEXT_PUBLIC_TELEGRAM_BOT;
  const botUrl = `https://t.me/${botUsername}`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t("login.title")}</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t("login.instruction")}{" "}
          <a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            @{botUsername}
          </a>
        </p>
      </div>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={onChange}
        autoFocus
        disabled={isPending}
      >
        <InputOTPGroup className="gap-2">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {isPending && (
        <p className="text-sm text-muted-foreground">{t("login.verifying")}</p>
      )}
    </div>
  );
};
