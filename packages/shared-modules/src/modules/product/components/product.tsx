"use client";
import { PageHeader } from "@repo/shared-modules/components/page-header/page-header";
import { ProductBasicInformation } from "./product-basic-information/product-basic-information";
import { ProductAddToCart } from "./product-add-to-cart/product-add-to-cart";
import { ProductDescription } from "./product-description";
import { SimilarProducts } from "./similar-products";
import { IProductResponse } from "@repo/api/services/products/index";
import { useEffect } from "react";
import { useProductCart } from "@repo/hooks/index";
import { useLocale } from "next-intl";
import { ProductDeliveryTime } from "./product-delivery-time/product-delivery-time";
import { StarRating } from "../../reviews/components/star-rating";
import { CustomLink } from "@repo/shared-modules/components/custom-link";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ReviewService } from "@repo/api/services/review/review.service";
import { Card } from "@repo/ui/components/ui/card";

interface IProps {
  product: IProductResponse;
  shopId: string;
}

export const Product = ({ product, shopId }: IProps) => {
  const lang = useLocale();
  const t = useTranslations("reviews");
  const {
    selectedVariant,
    setSelectedVariant,
    currentQuantity,
    isLoading,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    initializeDefaultVariant,
  } = useProductCart(product);

  useEffect(() => {
    initializeDefaultVariant();
  }, [initializeDefaultVariant]);

  const hasReviews = (product.review_count ?? 0) > 0;

  const { data: topReviewData } = useQuery({
    queryKey: ["top-review", product._id],
    queryFn: () =>
      ReviewService.getProductReviews(product._id, {
        page: 1,
        limit: 1,
        sortBy: "rating",
        sortOrder: "desc",
      }),
    enabled: hasReviews,
  });

  const topReview = topReviewData?.data?.[0];

  return (
    <div className="space-y-3">
      <PageHeader
        title={product.name[lang as keyof typeof product.name]}
        titleClassName="pl-8"
      />
      <div className="px-4 pb-3 space-y-3">
        <ProductBasicInformation product={product} />
        <ProductAddToCart
          product={product}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
          currentQuantity={currentQuantity}
          onAddToCart={handleAddToCart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          isAddingToCart={isLoading}
        />
        {product.delivery_time ? (
          <ProductDeliveryTime deliveryTime={product.delivery_time} />
        ) : null}
        <ProductDescription product={product} />

        {hasReviews && (
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
              <CustomLink
                href={`/products/${product._id}/reviews`}
                className="block"
              >
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
        )}

        <SimilarProducts product={product} shopId={shopId} />
      </div>
    </div>
  );
};
