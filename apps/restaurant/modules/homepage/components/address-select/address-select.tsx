"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { LocationEdit } from "@repo/ui/icons";
import { AddressSelect as SharedAddressSelect } from "@/components/address-select/address-select";

export const AddressSelect = () => {
  return (
    <Drawer>
      <DrawerTrigger className="bg-primary/10  w-full text-primary py-2 border-y border-primary/20 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
        <LocationEdit className="w-4 h-4" /> <span>AddressSelect</span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>
          <SharedAddressSelect />
        </DrawerTitle>
      </DrawerContent>
    </Drawer>
  );
};
