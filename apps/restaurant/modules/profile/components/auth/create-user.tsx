import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
} from "@repo/ui/components/ui/form";
import { Steps } from "../login-button";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { ICreateUserRequest } from "@repo/api/services/user/user.interface";
import { createUserValidator } from "@repo/api/services/user/user.schema";
import { useTranslations } from "next-intl";
import { UserService } from "@repo/api/services/user/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateUserProps = {
  setSteps: (steps: Steps) => void;
  phone: string;
  setIsOpen: (isOpen: boolean) => void;
};

export const CreateUser = ({ setSteps, phone, setIsOpen }: CreateUserProps) => {
  const t = useTranslations("profile");
  const queryClient = useQueryClient();
  const { mutate: createUser, isPending } = useMutation({
    mutationFn: (data: ICreateUserRequest) => UserService.createUser(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setSteps("check-user");
      setIsOpen(false);
    },
  });

  const form = useForm({
    resolver: joiResolver(createUserValidator),
    defaultValues: {
      phone,
      password: "",
      full_name: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: ICreateUserRequest) => {
    createUser(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 mt-9"
      >
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("full_name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-12"
                  placeholder={t("full_name")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
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
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirm_password")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-12"
                  type="password"
                  placeholder={t("confirm_password")}
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
