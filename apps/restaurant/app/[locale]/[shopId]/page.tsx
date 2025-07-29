import { HomepagePage } from "@/modules/homepage/pages";
import { ICommonParamsAsync } from "@/utils/interfaces";
import { CategoriesService, ProductService } from "@repo/api/services";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

export default async function HomePage({ params }: ICommonParamsAsync) {
  const { shopId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories", shopId, { is_popular: true }],
    queryFn: () =>
      CategoriesService.getPublicCategories(shopId, { is_popular: true }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories", shopId, { is_popular: false }],
    queryFn: () =>
      CategoriesService.getPublicCategories(shopId, { is_popular: false }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["most-popular-products", shopId],
    queryFn: () => ProductService.getProductsByCategory(shopId, "most-popular"),
  });

  await queryClient.prefetchQuery({
    queryKey: ["new-arrivals-products", shopId],
    queryFn: () => ProductService.getProductsByCategory(shopId, "new-arrivals"),
  });

  await queryClient.prefetchQuery({
    queryKey: ["on-sale-products", shopId],
    queryFn: () => ProductService.getProductsByCategory(shopId, "on-sale"),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomepagePage shopId={shopId} />
    </HydrationBoundary>
  );
}
