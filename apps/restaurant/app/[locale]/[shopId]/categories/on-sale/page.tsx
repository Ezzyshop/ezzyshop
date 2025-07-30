import { OnSaleProductsPage } from "@/modules/categories/page";
import { ICommonParamsAsync } from "@/utils/interfaces";
import { ProductService } from "@repo/api/services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function OnSaleProducts({ params }: ICommonParamsAsync) {
  const { shopId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["on-sale-products"],
    queryFn: () => ProductService.getProductsByCategory(shopId, "on-sale"),
    initialPageParam: 1,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <OnSaleProductsPage shopId={shopId} />
    </HydrationBoundary>
  );
}
