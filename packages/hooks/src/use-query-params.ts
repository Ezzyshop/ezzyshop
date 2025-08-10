"use client";

import qs from "qs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TDynamic = string | number | boolean | object | undefined;

export type TObject<T = TDynamic> = Record<string, T>;

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getQueryParams = (excludeKeys: string[] = []): TObject => {
    const searchString = searchParams?.toString() ?? "";
    const queryParams = qs.parse(searchString, { ignoreQueryPrefix: true });
    const excludedKeysSet = new Set(excludeKeys);

    return Object.keys(queryParams).reduce((filteredParams, key) => {
      if (!excludedKeysSet.has(key)) {
        filteredParams[key] = (queryParams as TObject)[key]!;
      }
      return filteredParams;
    }, {} as TObject);
  };

  const setQueryParams = (newQuery: TObject): void => {
    const queryString = qs.stringify(newQuery, { arrayFormat: "repeat" });
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  };

  return {
    getQueryParams,
    setQueryParams,
  };
};
