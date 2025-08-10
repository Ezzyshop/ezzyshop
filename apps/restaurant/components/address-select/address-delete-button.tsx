import { AddressService } from "@repo/api/services/address/address.service";
import { TrashIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface IProps {
  id: string;
}

export const AddressDeleteButton = ({ id }: IProps) => {
  const t = useTranslations("profile.address");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const { mutate: deleteAddress, isPending: isLoading } = useMutation({
    mutationFn: AddressService.deleteAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["addresses", user?._id],
      });
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive" size="icon" className="size-6">
          <TrashIcon className="size-3" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 pt-0 space-y-3">
        <div>
          <DrawerTitle className="text-center">
            {t("delete-address")}
          </DrawerTitle>

          <DrawerFooter className="grid grid-cols-2 gap-2 p-0 mt-4">
            <Button
              disabled={isLoading}
              variant="destructive"
              onClick={() => deleteAddress(id)}
            >
              {t("delete")}
            </Button>
            <DrawerTrigger asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DrawerTrigger>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
