import { CategoryPage } from "@/modules/categories/page";
import { ICommonParamsAsync } from "@/utils/interfaces";
import { CategoriesService } from "@repo/api/services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Category({ params }: ICommonParamsAsync) {
  const { categoryId, shopId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["category", categoryId],
    queryFn: () => CategoriesService.getCategory(shopId, categoryId!),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage shopId={shopId} categoryId={categoryId} />
    </HydrationBoundary>
  );
}
