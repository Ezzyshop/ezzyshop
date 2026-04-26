import { ProductReviewsPage } from "@repo/shared-modules/modules/reviews/pages/product-reviews.page";
import { ProductService } from "@repo/api/services/products/index";
import { ICommonParamsAsync } from "@/utils/interfaces";

export default async function ProductReviews({ params }: ICommonParamsAsync) {
  const { shopId, productId } = await params;

  let avgRating = 0;
  let reviewCount = 0;

  try {
    const product = await ProductService.getProductById(shopId, productId!);
    avgRating = product.data.avg_rating ?? 0;
    reviewCount = product.data.review_count ?? 0;
  } catch {
    // Use defaults if prefetch fails
  }

  return (
    <ProductReviewsPage
      productId={productId!}
      avgRating={avgRating}
      reviewCount={reviewCount}
    />
  );
}
