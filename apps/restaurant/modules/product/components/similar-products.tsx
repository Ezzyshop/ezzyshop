import { ProductsGrid } from "@/components/products-group/products-grid";
import { CategoriesService } from "@repo/api/services/category/index";
import { IProductResponse } from "@repo/api/services/products/index";
import { Card } from "@repo/ui/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface IProps {
  product: IProductResponse;
  shopId: string;
}

export const SimilarProducts = ({ product, shopId }: IProps) => {
  const t = useTranslations("product");

  const { data: similarProducts } = useQuery({
    queryKey: ["similar-products", product._id],
    queryFn: () =>
      CategoriesService.getCategory(shopId, product.categories[0]!),
    enabled: !!product.categories[0],
  });

  if (!similarProducts?.products.length) return null;

  return (
    <Card className="shadow-none border-0 p-3 gap-2">
      <p className="text-lg font-medium">{t("similar_products")}</p>
      <ProductsGrid
        data={similarProducts.products}
        isLoading={similarProducts.isLoading}
      />
    </Card>
  );
};
