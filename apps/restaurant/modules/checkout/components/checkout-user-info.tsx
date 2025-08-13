"use client";

import { ChevronRightIcon, UserIcon } from "@repo/ui/components/icons/index";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { useTranslations } from "next-intl";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useForm, UseFormReturn } from "react-hook-form";
import { ICheckoutForm } from "../utils/checkout.interface";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  Form,
} from "@repo/ui/components/ui/form";
import { PhoneInput } from "@repo/ui/components/ui/phone-number-input";
import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { checkoutUserInfoValidator } from "../utils/checkout.validator";

interface IProps {
  form: UseFormReturn<ICheckoutForm>;
}

export const CheckoutUserInfo = ({ form }: IProps) => {
  const t = useTranslations("checkout.user");
  const [isOpen, setIsOpen] = useState(false);

  const userForm = useForm({
    resolver: joiResolver(checkoutUserInfoValidator),
    defaultValues: {
      name: form.getValues("customer_info.name"),
      phone: form.getValues("customer_info.phone"),
    },
  });

  const handleSave = (values: { name: string; phone: string }) => {
    form.setValue("customer_info.name", values.name);
    form.setValue("customer_info.phone", values.phone);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="flex items-center gap-2 w-full">
        <div className="flex items-start gap-2 flex-grow">
          <div className="rounded-full p-2 bg-primary/20">
            <UserIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground text-left">
              {t("title")}
            </p>
            <p className="font-medium text-left leading-5">
              {form.getValues("customer_info.name")}
            </p>
            <p className="text-sm text-muted-foreground text-left">
              {form.getValues("customer_info.phone")}
            </p>
          </div>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
      </DrawerTrigger>
      <DrawerContent className="p-3 pt-0">
        <DrawerTitle>{t("title")}</DrawerTitle>
        <DrawerDescription>{t("description")}</DrawerDescription>
        <Form {...userForm}>
          <form onSubmit={userForm.handleSubmit(handleSave)}>
            <div className="flex flex-col gap-2 mt-2">
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enter_name")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <PhoneInput placeholder={t("enter_phone")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={!userForm.formState.isValid}
                type="submit"
                className="w-full"
              >
                {t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
