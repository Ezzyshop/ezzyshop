"use client";
import { SearchInput } from "@/components/search-input";
import { ICommonParams } from "@/utils/interfaces";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export const HomepageSearch = () => {
  const { shopId, locale } = useParams<ICommonParams>();
  const router = useRouter();

  const onClickSearch = () => {
    router.push(`/${locale}/${shopId}/search`);
  };

  return (
    <div className="flex items-center gap-2 px-4 relative">
      <div className="w-full relative">
        <SearchInput disabled className="disabled:opacity-100" />
        <div
          className="absolute right-0 top-0 bottom-0 w-full cursor-pointer"
          onClick={onClickSearch}
        />
      </div>
    </div>
  );
};
