"use client";
import { ReviewService } from "@repo/api/services/review/review.service";
import { IReviewResponse } from "@repo/api/services/review/review.interface";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { Separator } from "@repo/ui/components/ui/separator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReviewCard } from "../components/review-card";
import { FetchNextPage } from "@repo/shared-modules/components/products-group/products-grid";
import Image from "next/image";
import { useState } from "react";
import { StarRating } from "../components/star-rating";

interface IProps {
  productId: string;
  avgRating: number;
  reviewCount: number;
}

export const ProductReviewsPage = ({ productId, avgRating, reviewCount }: IProps) => {
  const t = useTranslations("reviews");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["product-reviews", productId],
    queryFn: ({ pageParam }) =>
      ReviewService.getProductReviews(productId, { page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.paginationInfo.hasNextPage ? lastPage.paginationInfo.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

  const allReviews: IReviewResponse[] = data?.pages.flatMap((p) => p.data) ?? [];

  const allImages = allReviews.flatMap((r) => r.images);

  return (
    <>
      <div className="flex-grow flex flex-col">
        <PageHeader title={t("reviews")} />

        <div className="px-4 pb-6 space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
            <div className="space-y-1">
              <StarRating value={Math.round(avgRating)} readonly size="md" />
              <p className="text-xs text-muted-foreground">
                {t("review_count", { count: reviewCount })}
              </p>
            </div>
          </div>

          {/* Images gallery */}
          {allImages.length > 0 && (
            <>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setLightboxSrc(img)}
                    className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Review list */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : allReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("no_reviews")}</p>
          ) : (
            <div className="space-y-1 divide-y divide-border">
              {allReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
              <FetchNextPage
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
              />
            </div>
          )}
        </div>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative w-full max-w-sm aspect-square mx-4">
            <Image src={lightboxSrc} alt="" fill className="object-contain" sizes="400px" />
          </div>
        </div>
      )}
    </>
  );
};
