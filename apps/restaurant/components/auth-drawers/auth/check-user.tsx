import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { PhoneInput } from "@repo/ui/components/ui/phone-number-input";
import {
  checkUserExistsValidator,
  UserService,
} from "@repo/api/services/user/index";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/ui/button";
import { Steps } from "../login-drawer";

type CheckUserProps = {
  setSteps: (steps: Steps) => void;
  setPhone: (phone: string) => void;
};

export const CheckUser = ({ setSteps, setPhone }: CheckUserProps) => {
  const t = useTranslations("profile");
  const { mutate: checkUserExists, isPending } = useMutation({
    mutationFn: (phone: string) => UserService.checkUserExists(phone),
    onSuccess: (data) => {
      if (data.data) {
        setSteps("login");
      } else {
        setSteps("create-user");
      }
    },
  });

  const form = useForm({
    resolver: joiResolver(checkUserExistsValidator),
    defaultValues: {
      phone: "+998",
    },
  });

  const isPhoneNumberValid = form.watch("phone").length === 13;

  const onSubmit = (data: { phone: string }) => {
    setPhone(data.phone);
    checkUserExists(data.phone);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="mt-9">
              <FormControl>
                <PhoneInput {...field} className="h-12" defaultCountry="UZ" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
          size="xl"
          disabled={isPending || !isPhoneNumberValid}
        >
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};
