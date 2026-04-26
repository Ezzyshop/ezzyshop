"use client";
import { IReviewResponse } from "@repo/api/services/review/review.interface";
import { Card } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { StarRating } from "./star-rating";
import dayjs from "dayjs";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface IProps {
  review: IReviewResponse;
}

export const ReviewCard = ({ review }: IProps) => {
  const t = useTranslations("reviews");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <Card className="p-4 gap-2 border-none shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{review.user?.full_name ?? t("anonymous")}</p>
            <p className="text-xs text-muted-foreground">
              {dayjs(review.createdAt).format("DD.MM.YYYY")}
            </p>
          </div>
          <StarRating value={review.rating} readonly size="sm" />
        </div>

        {review.message && (
          <p className="text-sm text-foreground">{review.message}</p>
        )}

        {review.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {review.images.map((img) => (
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
        )}

        {review.reply && (
          <>
            <Separator />
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t("shop_reply")}</p>
              <p className="text-sm">{review.reply}</p>
            </div>
          </>
        )}
      </Card>

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
