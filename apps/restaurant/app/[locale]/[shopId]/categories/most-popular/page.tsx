import { MostPopularProductsPage } from "@/modules/categories/page";
import { ICommonParamsAsync } from "@/utils/interfaces";
import { ProductService } from "@repo/api/services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function MostPopularProducts({
  params,
}: ICommonParamsAsync) {
  const { shopId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["most-popular-products"],
    queryFn: () => ProductService.getProductsByCategory(shopId, "most-popular"),
    initialPageParam: 1,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MostPopularProductsPage shopId={shopId} />
    </HydrationBoundary>
  );
}
