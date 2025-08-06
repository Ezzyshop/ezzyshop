"use client";
import { joiResolver } from "@hookform/resolvers/joi";
import { IUpdateUserRequest } from "@repo/api/services/user/user.interface";
import { updateUserValidator } from "@repo/api/services/user/user.schema";
import { UserService } from "@repo/api/services/user/user.service";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { PhoneInput } from "@repo/ui/components/ui/phone-number-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";

export const ProfileForm = () => {
  const t = useTranslations("profile");
  const { user } = useUserContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<IUpdateUserRequest>({
    resolver: joiResolver(updateUserValidator),
    defaultValues: {
      full_name: user?.full_name,
      phone: user?.phone ?? undefined,
      email: user?.email ?? undefined,
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: IUpdateUserRequest) => UserService.updateUser(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.back();
    },
  });

  const handleUpdateUser = (data: IUpdateUserRequest) => {
    updateUserMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <Card className="px-3 py-3 shadow-none border-none">
      <CardHeader className="p-0">
        <CardTitle>{t("edit_profile")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateUser)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("full_name")}</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value!}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? t("saving") : t("save")}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
