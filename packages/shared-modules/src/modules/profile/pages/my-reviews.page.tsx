"use client";
import { ReviewService } from "@repo/api/services/review/review.service";
import { UploadService } from "@repo/api/services/upload/upload.service";
import { IReviewCreateItem } from "@repo/api/services/review/review.interface";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Separator } from "@repo/ui/components/ui/separator";
import { Card } from "@repo/ui/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
import { StarRating } from "../../reviews/components/star-rating";
import { ReviewCard } from "../../reviews/components/review-card";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { Camera, X } from "@repo/ui/components/icons/index";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";

interface IFormState {
  rating: number;
  message: string;
  imageFiles: File[];
  submitting: boolean;
}

const defaultForm = (): IFormState => ({
  rating: 5,
  message: "",
  imageFiles: [],
  submitting: false,
});

export const MyReviewsPage = () => {
  const { shopId } = useParams<ICommonParams>();
  const t = useTranslations("reviews");
  const tProfile = useTranslations("profile");
  const lang = useLocale() as keyof ILocale;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-products-with-reviews", shopId],
    queryFn: () => ReviewService.getMyOrderProductsWithReviews(shopId),
  });

  const items = [...(data?.data ?? [])].sort((a, b) => {
    if (!a.review && b.review) return -1;
    if (a.review && !b.review) return 1;
    return 0;
  });

  // Per-item form state keyed by `${orderId}:${productId}`
  const [forms, setForms] = useState<Record<string, IFormState>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getForm = (key: string): IFormState => forms[key] ?? defaultForm();

  const updateForm = (key: string, patch: Partial<IFormState>) =>
    setForms((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? defaultForm()), ...patch },
    }));

  const { mutateAsync: submitOne } = useMutation({
    mutationFn: async ({
      key,
      productId,
      orderId,
    }: {
      key: string;
      productId: string;
      orderId: string;
    }) => {
      const form = getForm(key);
      updateForm(key, { submitting: true });

      const uploadedUrls: string[] = [];
      for (const file of form.imageFiles) {
        const res = await UploadService.uploadImage(file, shopId, "review");
        uploadedUrls.push(res.data.url);
      }

      const item: IReviewCreateItem = {
        productId,
        orderId,
        rating: form.rating,
        message: form.message || undefined,
        images: uploadedUrls,
      };

      return ReviewService.createReviews(shopId, { products: [item] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-products-with-reviews", shopId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unreviewed-products", shopId],
      });
    },
    onSettled: (_, __, { key }) => {
      updateForm(key, { submitting: false });
    },
  });

  const handleImagePick = (key: string, files: FileList | null) => {
    if (!files) return;
    const form = getForm(key);
    const totalAllowed = 3 - form.imageFiles.length;
    const toAdd = Array.from(files).slice(0, totalAllowed);
    updateForm(key, { imageFiles: [...form.imageFiles, ...toAdd] });
  };

  const removeImage = (key: string, idx: number) => {
    const form = getForm(key);
    updateForm(key, {
      imageFiles: form.imageFiles.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader title={tProfile("my_reviews")} />

      <div className="px-4 pb-6 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {t("no_unreviewed")}
          </p>
        ) : (
          items.map((item, idx) => {
            const key = `${item.orderId}:${item.product._id}`;
            const form = getForm(key);
            const productName = item.product.name[lang] ?? item.product.name.uz;

            return (
              <div key={key}>
                <Card className="p-4 gap-3 border-none shadow-sm">
                  {/* Product header */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.main_image}
                        alt={productName}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {productName}
                      </p>
                    </div>
                  </div>

                  {item.review ? (
                    /* Already reviewed — show review + admin reply */
                    <ReviewCard review={item.review} />
                  ) : (
                    /* Not reviewed — show inline form */
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {t("rating")}
                        </p>
                        <StarRating
                          value={form.rating}
                          size="lg"
                          onChange={(val) => updateForm(key, { rating: val })}
                        />
                      </div>

                      <Textarea
                        placeholder={t("message_placeholder")}
                        value={form.message}
                        onChange={(e) =>
                          updateForm(key, { message: e.target.value })
                        }
                        rows={3}
                      />

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {t("photos_optional")}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {form.imageFiles.map((file, fi) => (
                            <div
                              key={fi}
                              className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                            >
                              <Image
                                src={URL.createObjectURL(file)}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(key, fi)}
                                className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                          {form.imageFiles.length < 3 && (
                            <button
                              type="button"
                              onClick={() => inputRefs.current[key]?.click()}
                              className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Camera className="w-6 h-6" />
                              <input
                                ref={(el) => {
                                  inputRefs.current[key] = el;
                                }}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) =>
                                  handleImagePick(key, e.target.files)
                                }
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        disabled={form.submitting}
                        onClick={() =>
                          submitOne({
                            key,
                            productId: item.product._id,
                            orderId: item.orderId,
                          })
                        }
                      >
                        {form.submitting ? t("submitting") : t("submit_review")}
                      </Button>
                    </div>
                  )}
                </Card>

                {idx < items.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
