import { IProductResponse } from "@repo/api/services/products/product.interface";
import { Card } from "@repo/ui/components/ui/card";
import { StarRating } from "../../reviews/components/star-rating";
import { CustomLink } from "@repo/shared-modules/components/custom-link";
import { ReviewService } from "@repo/api/services/review/review.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface IProps {
  product: IProductResponse;
}

export const ProductReview = ({ product }: IProps) => {
  const t = useTranslations("reviews");

  const { data: topReviewData } = useQuery({
    queryKey: ["top-review", product._id],
    queryFn: () =>
      ReviewService.getProductReviews(product._id, {
        page: 1,
        limit: 1,
        sortBy: "rating",
        sortOrder: "desc",
      }),
  });

  const topReview = topReviewData?.data?.[0];

  return (
    <Card className="p-4 gap-3 border-none shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating
            value={Math.round(product.avg_rating ?? 0)}
            readonly
            size="sm"
          />
          <span className="text-sm font-semibold">
            {(product.avg_rating ?? 0).toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({t("review_count", { count: product.review_count ?? 0 })})
          </span>
        </div>
        <CustomLink href={`/products/${product._id}/reviews`}>
          <span className="text-sm text-primary font-medium">
            {t("see_all_reviews")} →
          </span>
        </CustomLink>
      </div>

      {topReview && (
        <CustomLink href={`/products/${product._id}/reviews`} className="block">
          <div className="space-y-1 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {topReview.user?.full_name ?? t("anonymous")}
              </p>
              <StarRating value={topReview.rating} readonly size="sm" />
            </div>
            {topReview.message && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {topReview.message}
              </p>
            )}
          </div>
        </CustomLink>
      )}
    </Card>
  );
};
