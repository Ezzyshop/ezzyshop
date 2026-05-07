"use client";

import { ICommonParams } from "@/utils/interfaces";
import { ProductDrawer } from "@/components/product-drawer/classic/product-drawer";
import { CategoriesService } from "@repo/api/services/category/category.service";
import { ProductService } from "@repo/api/services/products/product.service";
import { IProductResponse } from "@repo/api/services/products/product.interface";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TMergedProductAndCategory } from "../utils/types";
import { Categories } from "./components/classic/categories";
import { HomepageSkeleton } from "./components/classic/homepage-skeleton";
import { PopularCategories } from "./components/classic/hot-categories";
import { MergedCategoriesAndProducts } from "./components/classic/merged-categories-and-products";

export const ClassicHome = () => {
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

  const isHomePageLoading =
    categoriesQuery.isLoading || productsQuery.isLoading;

  const categories = categoriesQuery.data?.data;
  const products = productsQuery.data?.data;

  const mergedProductsAndCategories: TMergedProductAndCategory[] =
    useMemo(() => {
      if (!categories || !products) return [];
      return categories
        ?.map((category) => ({
          ...category,
          products: products?.filter(
            (product) =>
              product.categories.includes(category._id) &&
              product.variants.some((v) => Boolean(v.quantity))
          ),
        }))
        .filter((item) => Boolean(item.products.length));
    }, [categories, products]);

  if (isHomePageLoading) {
    return <HomepageSkeleton />;
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
};
