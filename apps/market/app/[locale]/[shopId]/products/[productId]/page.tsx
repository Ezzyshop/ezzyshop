import { ProductPage } from "@/modules/product/pages/product.page";
import { ICommonParamsAsync } from "@/utils/interfaces";
import { ProductService } from "@repo/api/services/products/index";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Product({ params }: ICommonParamsAsync) {
  const { shopId, productId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["product", shopId, productId],
    queryFn: () => ProductService.getProductById(shopId, productId!),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductPage shopId={shopId} productId={productId!} />
    </HydrationBoundary>
  );
}
