"use client";
import { OrderService } from "@repo/api/services/order/order.service";
import { ReviewService } from "@repo/api/services/review/review.service";
import { UploadService } from "@repo/api/services/upload/upload.service";
import {
  IReviewCreateItem,
  IReviewResponse,
} from "@repo/api/services/review/review.interface";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Separator } from "@repo/ui/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useRef, useState } from "react";
import Image from "next/image";
import { StarRating } from "../components/star-rating";
import { ReviewCard } from "../components/review-card";
import { ICommonParams } from "@repo/shared-modules/utils/interfaces";
import { Camera, X } from "@repo/ui/components/icons/index";
import { ILocale } from "@repo/api/utils/interfaces/base.interface";

interface IProductReviewState {
  productId: string;
  orderId: string;
  productName: string;
  productImage: string;
  rating: number;
  message: string;
  images: string[];
  imageFiles: File[];
}

export const ReviewOrderPage = () => {
  const { shopId, orderId, locale } = useParams<
    ICommonParams & { orderId: string }
  >();
  const t = useTranslations("reviews");
  const lang = useLocale() as keyof ILocale;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", shopId, orderId],
    queryFn: () => OrderService.getOrder(shopId, orderId),
  });

  const { data: myReviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["my-order-reviews", orderId],
    queryFn: () => ReviewService.getMyOrderReviews(orderId),
  });

  const [reviews, setReviews] = useState<IProductReviewState[]>([]);
  const [initialized, setInitialized] = useState(false);

  const existingReviewMap = new Map<string, IReviewResponse>(
    (myReviewsData?.data ?? []).map((r) => [r.product._id, r]),
  );

  if (orderData?.data && myReviewsData !== undefined && !initialized) {
    setInitialized(true);
    setReviews(
      orderData.data.products
        .filter((p) => !existingReviewMap.has(p.product._id))
        .map((p) => ({
          productId: p.product._id,
          orderId,
          productName: p.product.name[lang] ?? p.product.name.uz,
          productImage: p.product.main_image,
          rating: 5,
          message: "",
          images: [],
          imageFiles: [],
        })),
    );
  }

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const items: IReviewCreateItem[] = [];

      for (const review of reviews) {
        const uploadedUrls: string[] = [];

        for (const file of review.imageFiles) {
          const res = await UploadService.uploadImage(file);
          uploadedUrls.push(res.data.url);
        }

        items.push({
          productId: review.productId,
          orderId: review.orderId,
          rating: review.rating,
          message: review.message || undefined,
          images: [...review.images, ...uploadedUrls],
        });
      }

      return ReviewService.createReviews(shopId, { products: items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-order-reviews", orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-products-with-reviews", shopId] });
      queryClient.invalidateQueries({ queryKey: ["unreviewed-products", shopId] });
      router.back();
    },
  });

  const handleImagePick = (index: number, files: FileList | null) => {
    if (!files) return;
    const current = reviews[index]!;
    const totalAllowed = 3 - current.images.length - current.imageFiles.length;
    const toAdd = Array.from(files).slice(0, totalAllowed);

    setReviews((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, imageFiles: [...r.imageFiles, ...toAdd] } : r,
      ),
    );
  };

  const removeImageFile = (reviewIdx: number, fileIdx: number) => {
    setReviews((prev) =>
      prev.map((r, i) =>
        i === reviewIdx
          ? { ...r, imageFiles: r.imageFiles.filter((_, fi) => fi !== fileIdx) }
          : r,
      ),
    );
  };

  const isLoading = isOrderLoading || isReviewsLoading;

  if (isLoading || !orderData) {
    return (
      <div className="flex-grow flex flex-col">
        <PageHeader title={t("review_order")} />
        <div className="px-4 space-y-4 animate-pulse">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const allProducts = orderData.data.products;

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader title={t("review_order")} />

      <div className="px-4 pb-6 space-y-4">
        {allProducts.map((p, idx) => {
          const existing = existingReviewMap.get(p.product._id);
          const formIdx = reviews.findIndex(
            (r) => r.productId === p.product._id,
          );

          return (
            <div key={p.product._id} className="space-y-3">
              {/* Product header */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={p.product.main_image}
                    alt={p.product.name[lang] ?? p.product.name.uz}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <p className="font-medium text-sm line-clamp-2">
                  {p.product.name[lang] ?? p.product.name.uz}
                </p>
              </div>

              {existing ? (
                /* Already reviewed — show the submitted review */
                <ReviewCard review={existing} />
              ) : formIdx !== -1 ? (
                /* Review form for this product */
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("rating")}
                    </p>
                    <StarRating
                      value={reviews[formIdx]!.rating}
                      size="lg"
                      onChange={(val) =>
                        setReviews((prev) =>
                          prev.map((r, i) =>
                            i === formIdx ? { ...r, rating: val } : r,
                          ),
                        )
                      }
                    />
                  </div>

                  <Textarea
                    placeholder={t("message_placeholder")}
                    value={reviews[formIdx]!.message}
                    onChange={(e) =>
                      setReviews((prev) =>
                        prev.map((r, i) =>
                          i === formIdx ? { ...r, message: e.target.value } : r,
                        ),
                      )
                    }
                    rows={3}
                  />

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {t("photos_optional")}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {reviews[formIdx]!.imageFiles.map((file, fi) => (
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
                            onClick={() => removeImageFile(formIdx, fi)}
                            className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}

                      {reviews[formIdx]!.imageFiles.length +
                        reviews[formIdx]!.images.length <
                        3 && (
                        <button
                          type="button"
                          onClick={() => inputRefs.current[formIdx]?.click()}
                          className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Camera className="w-6 h-6" />
                          <input
                            ref={(el) => {
                              inputRefs.current[formIdx] = el;
                            }}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                              handleImagePick(formIdx, e.target.files)
                            }
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : null}

              {idx < allProducts.length - 1 && <Separator />}
            </div>
          );
        })}

        {reviews.length > 0 && (
          <Button
            className="w-full"
            disabled={submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            {submitMutation.isPending ? t("submitting") : t("submit_review")}
          </Button>
        )}
      </div>
    </div>
  );
};
