"use client";
import { ICommonParams } from "@/utils/interfaces";
import { CategoriesService } from "@repo/api/services/category/category.service";
import { ProductService } from "@repo/api/services/products/product.service";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Categories } from "./components/categories";
import { MergedCategoriesAndProducts } from "./components/merged-categories-and-products";
import { TMergedProductAndCategory } from "../utils/types";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { ProductDrawer } from "@/components/product-drawer/product-drawer";
import { PopularCategories } from "./components/hot-categories";

export default function HomePage() {
  const { shopId } = useParams<ICommonParams>();
  const [selectedProduct, setSelectedProduct] =
    useState<IProductResponse | null>(null);
  const [categoriesQuery, productsQuery] = useQueries({
    queries: [
      {
        queryKey: ["categories", shopId, { is_popular: false }],
        queryFn: () =>
          CategoriesService.getPublicCategories(shopId, {
            is_popular: false,
          }),
      },
      {
        queryKey: ["public-products", shopId, { limit: 6 }],
        queryFn: () =>
          ProductService.getPublicProducts(shopId, {
            limit: "all" as const,
          }),
      },
    ],
  });

  const isHomePageReady = !(
    categoriesQuery.isLoading && productsQuery.isLoading
  );

  const categories = categoriesQuery.data?.data;
  const products = productsQuery.data?.data;

  const mergedProductsAndCategories: TMergedProductAndCategory[] =
    useMemo(() => {
      if (!categories || !products) return [];
      return categories
        ?.map((category) => ({
          ...category,
          products: products?.filter((product) =>
            product.categories.includes(category._id)
          ),
        }))
        .filter((item) => Boolean(item.products.length));
    }, [categories, products]);

  if (!isHomePageReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PopularCategories />
      <Categories categories={mergedProductsAndCategories ?? []} />
      <MergedCategoriesAndProducts
        setSelectedProduct={setSelectedProduct}
        mergedCategoriesAndProducts={mergedProductsAndCategories ?? []}
      />
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
}
