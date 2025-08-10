"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import {
  addressSchema,
  IAddressRequest,
} from "@repo/api/services/address/index";
import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@repo/ui/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { YandexMap } from "@repo/ui/components/ui/yandex-map";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface IAddAddressForm {
  address: {
    address: string;
    lat: number;
    lng: number;
  };
  name: string;
  entrance?: string;
  floor?: string;
  room?: string;
  note?: string;
}

interface IProps {
  onSubmit: (data: IAddressRequest) => void;
  isLoading: boolean;
}

export const AddAddressForm = ({ onSubmit, isLoading }: IProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const t = useTranslations("profile.address");
  const form = useForm<IAddAddressForm>({
    resolver: joiResolver(addressSchema),
    defaultValues: {
      address: {
        address: "",
        lat: 41.2995,
        lng: 69.2401,
      },
      name: "",
      entrance: "",
      floor: "",
      room: "",
      note: "",
    },
  });

  const handleSubmit = (data: IAddAddressForm) => {
    const dataToSubmit: IAddressRequest = {
      address: data.address.address,
      lat: data.address.lat,
      lng: data.address.lng,
      name: data.name,
      entrance: data.entrance,
      floor: data.floor,
      room: data.room,
      note: data.note,
    };

    for (const key in dataToSubmit) {
      if (dataToSubmit[key as keyof typeof dataToSubmit] === "") {
        delete dataToSubmit[key as keyof typeof dataToSubmit];
      }
    }

    onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <Controller
        control={form.control}
        name="address"
        render={({ field }) => (
          <YandexMap
            initialCoordinates={[
              Number(field.value.lat),
              Number(field.value.lng),
            ]}
            onLocationSelect={({ coordinates, address }) => {
              field.onChange({
                ...field.value,
                lat: coordinates[0],
                lng: coordinates[1],
                address,
              });
              setIsDrawerOpen(true);
            }}
            height="calc(100vh - 117px)"
          />
        )}
      />
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="!max-h-[90vh] h-[90vh] mt-0">
          <DrawerTitle className="hidden">{t("add-new-address")}</DrawerTitle>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4 p-4 rounded-t-lg">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("address-name")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("enter-address-name")} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("address")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("enter-address")} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="entrance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("entrance")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("enter-entrance")} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("floor")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("enter-floor")} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("enter-room")} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("note")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("enter-note")} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-full" size="lg" disabled={isLoading}>
                {t("save")}
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </Form>
  );
};
