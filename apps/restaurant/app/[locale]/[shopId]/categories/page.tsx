import { CategoriesPage } from "@repo/shared-modules/modules/categories/page";
import { ICommonParamsAsync } from "@/utils/interfaces";

export default async function Categories({ params }: ICommonParamsAsync) {
  const { shopId } = await params;

  return <CategoriesPage shopId={shopId} />;
}
