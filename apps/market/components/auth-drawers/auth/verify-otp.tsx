import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { verifyOtpValidator } from "@repo/api/services/user/user.schema";
import { Form, FormField, FormItem } from "@repo/ui/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/ui/input-otp";
import { IVerifyOtpRequest } from "@repo/api/services/user/user.interface";
import { UserService } from "@repo/api/services/user/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface IProps {
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export const VerifyOtp = ({
  setIsOpen,
  onSuccess: onSuccessCallback,
}: IProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: joiResolver(verifyOtpValidator),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: (data: IVerifyOtpRequest) => UserService.verifyOtp(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });

      setIsOpen(false);
      onSuccessCallback?.();
    },
  });

  const handleSubmitForm = (data: IVerifyOtpRequest) => {
    verifyOtp(data);
  };

  const otp = form.watch("otp");

  useEffect(() => {
    if (otp?.length === 6) {
      verifyOtp({ otp });
    }
  }, [otp, verifyOtp]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="w-full flex flex-col gap-3 items-center"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center gap-3">
              <p className="text-md text-foreground/80 mt-5 max-w-md text-center">
                <a
                  href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT}`}
                  target="_blank"
                  className="text-primary"
                  rel="noopener noreferrer"
                >
                  @{process.env.NEXT_PUBLIC_TELEGRAM_BOT}
                </a>{" "}
                botiga kiring va 1 martalik kodingizni oling.
              </p>
              <InputOTP maxLength={6} {...field} autoFocus disabled={isPending}>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
