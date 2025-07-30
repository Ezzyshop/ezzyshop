import { NewArrivalsProductsPage } from "@/modules/categories/page/new-arrivals.page";
import { ICommonParamsAsync } from "@/utils/interfaces";
import { ProductService } from "@repo/api/services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function NewArrivalsProducts({
  params,
}: ICommonParamsAsync) {
  const { shopId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["new-arrivals-products"],
    queryFn: () => ProductService.getProductsByCategory(shopId, "new-arrivals"),
    initialPageParam: 1,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NewArrivalsProductsPage shopId={shopId} />
    </HydrationBoundary>
  );
}
