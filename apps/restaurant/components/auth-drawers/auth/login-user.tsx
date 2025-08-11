import { useForm } from "react-hook-form";
import { Steps } from "../login-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { loginUserValidator } from "@repo/api/services/user/user.schema";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@repo/api/services/user/user.service";
import { ILoginRequest } from "@repo/api/services/user/user.interface";
import { useTranslations } from "next-intl";
import { Input } from "@repo/ui/components/ui/input";

type LoginUserProps = {
  phone: string;
  setSteps: (steps: Steps) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const LoginUser = ({ phone, setSteps, setIsOpen }: LoginUserProps) => {
  const t = useTranslations("profile");
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: joiResolver(loginUserValidator),
    defaultValues: {
      phone,
      password: "",
    },
  });

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: (data: ILoginRequest) => UserService.loginUser(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setIsOpen(false);
      setSteps("check-user");
    },
    onError: () => {
      form.resetField("password");
      form.setError("password", { message: t("invalid_password") });
    },
  });



  const onSubmit = (data: ILoginRequest) => {
    loginUser(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-9">
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-12"
                  type="password"
                  placeholder={t("password")}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
          size="xl"
          disabled={isPending || !form.formState.isValid}
        >
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};
