import { ICommonParams } from "@/utils/interfaces";
import { IOrderResponse } from "@repo/api/services/order/order.interface";
import { TransactionService } from "@repo/api/services/transaction/transaction.service";
import { UploadService } from "@repo/api/services/upload/upload.service";
import {
  Camera,
  CheckCircle,
  Upload,
  UploadIcon,
} from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useRef, useState } from "react";

interface IProps {
  order: IOrderResponse;
}

export const ConfirmCardTransferUploadImage = ({ order }: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { shopId, locale } = useParams<ICommonParams>();
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (fileUrl: string) =>
      TransactionService.sendCheque(shopId, order.transaction._id, fileUrl),
    onSuccess: () => {
      router.push(`/${locale}/${shopId}/checkout/success`);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => UploadService.uploadImage(file),
    onSuccess: (data) => {
      mutate(data.data.url);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        return;
      }

      setFile(selectedFile);
    }
  };

  const getFileContent = () => {
    if (!file) {
      return (
        <div
          className="space-y-2 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex justify-center gap-2">
            <Camera className="w-8 h-8 text-muted-foreground" />
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">
            {t(
              "checkout.confirm-card-transfer.payment-verification.upload-info"
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {t(
              "checkout.confirm-card-transfer.payment-verification.accepted-formats"
            )}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
        <p className="text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setFile(null);
            inputRef.current!.value = "";
          }}
        >
          {t("checkout.confirm-card-transfer.payment-verification.remove")}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Label htmlFor="receipt">
          {t("checkout.confirm-card-transfer.payment-verification.upload")}
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          {getFileContent()}
          <Input
            id="receipt"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            ref={inputRef}
          />
        </div>
      </div>

      <Button
        className="w-full"
        disabled={!file || isPending || uploadMutation.isPending}
        onClick={() => uploadMutation.mutate(file!)}
      >
        <UploadIcon />{" "}
        {t("checkout.confirm-card-transfer.payment-verification.button")}
      </Button>
    </div>
  );
};
