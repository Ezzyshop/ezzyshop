import { Button } from "@repo/ui/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TransactionService } from "@repo/api/services/transaction/index";
import { useShopContext } from "@/contexts/shop.context";
import { useRef } from "react";
import { UploadService } from "@repo/api/services/upload/index";

interface IProps {
  transactionId: string;
}

export const OrderChequeUploadButton = ({ transactionId }: IProps) => {
  const t = useTranslations("orders");
  const { _id: shopId } = useShopContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutate: uploadChequeImage, isPending } = useMutation({
    mutationFn: (cheque_image: string) =>
      TransactionService.sendCheque(shopId, transactionId, cheque_image),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (image: File) => UploadService.uploadImage(image),
    onSuccess: (data) => {
      console.log(data);
      uploadChequeImage(data.data.url);
      inputRef.current!.value = "";
      inputRef.current!.files = null;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <div className="w-full mt-2">
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading || isPending}
        className="w-full"
      >
        {t("cheque_upload")}
      </Button>

      <input
        type="file"
        onChange={handleFileChange}
        ref={inputRef}
        hidden
        accept="image/*"
      />
    </div>
  );
};
